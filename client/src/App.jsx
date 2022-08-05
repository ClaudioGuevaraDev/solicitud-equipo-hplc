import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppProvider from "./context/AppProvider";
import RouterComponent from "./router/RouterComponent";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <RouterComponent />
      </BrowserRouter>
      <Toaster />
    </AppProvider>
  );
}

export default App;
