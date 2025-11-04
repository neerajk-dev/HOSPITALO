import { createRoot } from "react-dom/client"; 
import "./index.css"; 
import App from "./App.jsx"; 
import { BrowserRouter } from "react-router-dom"; 
import AdminContextProvider from "./context/AdminContext.jsx"; 
import DoctorContextProvider from "./context/DoctorContext.jsx"; 
import AppContextProvider from "./context/AppContext.jsx"; 
import { ThemeProvider } from "./context/ThemeContext.jsx";

// Mount the React app to the root DOM node
createRoot(document.getElementById("root")).render(
  <BrowserRouter> {/* Enables routing throughout the app */}
    <AdminContextProvider> {/* Provides admin context to the app */}
      <DoctorContextProvider> {/* Provides doctor context to the app */}
        <AppContextProvider> {/* Provides app-wide utilities context */}
          <ThemeProvider>
            <App /> {/* Main application component */}
          </ThemeProvider>
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
