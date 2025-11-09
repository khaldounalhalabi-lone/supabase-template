import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "./contexts/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import { AppRoutes } from "./routes"
import "./App.css"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
