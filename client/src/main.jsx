import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import "./index.css";

// Bootstrap
import "bootswatch/dist/cosmo/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const env = import.meta.env;
axios.defaults.baseURL = env.VITE_BACKEND_URL;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
