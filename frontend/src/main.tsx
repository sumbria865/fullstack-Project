import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles/index.css";

import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";
import { AppProvider } from "./context/AppContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ProjectProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ProjectProvider>
    </AuthProvider>
  </BrowserRouter>
);
