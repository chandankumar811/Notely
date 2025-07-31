import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.js";
import { ChatProvider } from "./contexts/ChatContext.jsx";
import { NoteProvider } from "./contexts/NoteContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <NoteProvider>
      <ChatProvider>
        <Router>
          <App />
        </Router>
      </ChatProvider>
    </NoteProvider>
  </Provider>
  // </StrictMode>,
);
