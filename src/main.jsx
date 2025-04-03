import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store/store.js'
import { ChatProvider } from './contexts/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
        <ChatProvider>
      <Router>
        <App />
      </Router>
      </ChatProvider>
    </Provider>
  // </StrictMode>,
)
