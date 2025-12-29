import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import AppRoutes from "./routes/AppRoutes";

import { ThemeProvider } from "./context/ThemeContext";
import "./global.css";

function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
