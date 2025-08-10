import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryProvider } from "./providers/QueryProvider.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryProvider>
);