---
title: Claude Code in Rust
category: AI agents; Rust
link: https://github.com/joserafaelSH/codecrafters-claude-code-rust
---

# Building a Tiny Claude Code in Rust

## Introduction

Tools like Claude Code look magical from the outside: you type a request and the assistant reads files, edits code, and runs commands on its own. Underneath, there is no magic. It is a loop around a language model that is allowed to call a few tools.

This project is my implementation of the CodeCrafters challenge **Build Your own Claude Code**, written in Rust. The goal was twofold: understand how a coding agent really works, and learn Rust by building something that is not a toy example. The result is a small terminal assistant that can read files, write files, run shell commands, and load reusable "skills" from markdown files, including skills that run as separate sub-agents.

The whole program is three source files and four JSON tool definitions.

## How it works

The core idea is the **agent loop**:

1. Send the conversation and the list of available tools to the model.
2. If the model answers with plain text, that is the final answer. Print it and stop.
3. If the model asks to call one or more tools, run them, append the results to the conversation, and go back to step 1.

The model never touches your machine directly. It only *asks*, and the program decides what to execute and what to report back. Everything an agent can do is bounded by the tools you hand it.

The program is run with a single prompt:

```
./your_program.sh -p "<prompt>"
```

The final answer goes to stdout, while tool activity and errors go to stderr, so the output stays clean enough to pipe into other commands.

## Project structure

```
src/
├── main.rs        # CLI, configuration, skill expansion
├── tools.rs       # agent loop and tool implementations
├── skills.rs      # skill discovery, parsing, argument expansion
└── tools/
    ├── read_tool.json
    ├── write_tool.json
    ├── bash_tool.json
    └── skill_tool.json
```

Each file has one responsibility, which keeps the program easy to follow:

- **`main.rs`** parses arguments, reads configuration, loads the skills, and builds the first messages.
- **`tools.rs`** contains the agent loop and the code behind each tool.
- **`skills.rs`** finds skills on disk and turns them into prompts.

## The entry point

`main.rs` uses `clap` to accept one `-p` / `--prompt` flag. The model provider is [OpenRouter](https://openrouter.ai), reached through the `async-openai` client, which works against any OpenAI-compatible endpoint. Two environment variables configure it:

- `OPENROUTER_API_KEY`: required. If it is missing, the program prints an error and exits with status 1.
- `OPENROUTER_BASE_URL`: optional, defaults to `https://openrouter.ai/api/v1`.

Before the first request, the program scans `.claude/skills/` and puts a short summary of every skill (name and description) in the system message. The model sees what skills exist without paying the token cost of every skill body.

If the prompt starts with `/`, it is treated as a slash command: leading tokens that match a known skill name are expanded into that skill's instructions, and the remaining text becomes the arguments. If nothing matches, the whole prompt is sent as a normal user message.

## The agent loop

The loop lives in `tools.rs` and uses the model `anthropic/claude-haiku-4.5`. A few details matter more than the loop itself:

- **A turn limit.** The loop stops after `MAX_TURNS` (50) model calls without a final answer. Without this, a model that keeps calling tools in a cycle would run forever and burn tokens.
- **Errors are data.** When a tool fails, the error is returned to the model as text instead of crashing the program. The model reads it and usually retries with a fix, such as correcting a wrong path. This single decision makes the agent far more resilient.
- **Tool schemas are embedded at compile time.** Each tool is described by a JSON file and loaded with `include_str!`, so the binary is self-contained and does not depend on files at runtime.

## The tools

Each tool has a JSON schema that tells the model its name, its purpose, and its parameters. For example, the `Write` tool:

```json
{
    "type": "function",
    "function": {
        "name": "Write",
        "description": "Write content to a file",
        "parameters": {
            "type": "object",
            "required": ["file_path", "content"],
            "properties": {
                "file_path": { "type": "string", "description": "The path of the file to write to" },
                "content": { "type": "string", "description": "The content to write to the file" }
            }
        }
    }
}
```

| Tool | What it does |
| --- | --- |
| **Read** | Returns the contents of a file. If the path is a directory, it reads the `SKILL.md` inside it. |
| **Write** | Writes content to a file, creating parent directories first if they do not exist. |
| **Bash** | Runs a command with `bash -c`. Stderr and a non-zero exit code are appended to the output so the model can see what went wrong. |
| **Skill** | Loads a skill by name, either inline or as a forked sub-agent. |

The description in each schema is part of the prompt. A clear name and description is how the model learns *when* to use a tool.

## Skills

A skill is a reusable set of instructions stored as markdown at `.claude/skills/<name>/SKILL.md`. It has a small front matter block and a body:

- `name`: how the skill is invoked.
- `description`: what the model sees in the summary, used to decide when the skill is relevant.
- `context`: when set to `fork`, the skill runs as a separate agent.

`skills.rs` finds every subdirectory containing a `SKILL.md`, parses the front matter, and keeps the skills in a `HashMap` keyed by name. The body is read lazily, only when the skill is used.

### Argument placeholders

Skill bodies can contain placeholders that are filled in when the skill is invoked: `$ARGUMENTS` for the full argument string, `$ARGUMENTS[i]` and `$i` for individual arguments. Indexed placeholders are replaced from the highest index down, so `$1` does not corrupt `$10`. It is a small detail, and exactly the kind of bug you only meet by building it.

### Forked skills

A skill with `context: fork` does not run inside the main conversation. It starts a **nested agent loop** with its own fresh message history, and only the final answer returns to the parent. This keeps the parent context small, since all the intermediate tool calls of the sub-task stay out of it.

## What I learned about Rust

A good part of the project's README is a set of notes on the Rust features it needed. The ones that mattered most:

- **`Result` and `Option`** made the "errors are data" design natural. Every tool returns a result, and the loop turns failures into text for the model.
- **Ownership** shaped how the message history is passed into nested agents: a forked skill gets its own history instead of sharing a mutable one.
- **Async with Tokio** is required by the HTTP client, even though the tools themselves are mostly synchronous.
- **`serde`** handles the JSON of tool schemas and tool-call arguments, and **`clap`** turns the CLI definition into a struct.

## Source code

The code is available on GitHub: [joserafaelSH/codecrafters-claude-code-rust](https://github.com/joserafaelSH/codecrafters-claude-code-rust).
