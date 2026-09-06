import { createBrowserRouter } from 'react-router-dom'
import App from './App'

// A single catch-all: the terminal is one persistent component instance
// whose scrollback state must survive navigation, not remount per route.
export const router = createBrowserRouter([{ path: '/*', element: <App /> }])
