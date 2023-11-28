import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import { ThemeProvider } from "./contexts/ThemeProvider";
import "./global-styles.css";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
