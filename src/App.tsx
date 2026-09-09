import '@/commands'
import { MobileApp } from '@/components/mobile/MobileApp'
import { Terminal } from '@/components/terminal/Terminal'
import { useIsMobile } from '@/hooks/useIsMobile'

function App() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileApp /> : <Terminal />
}

export default App
