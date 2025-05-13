import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'
import {ToastContainer} from 'react-toastify'
import UserContext from './context/UserContext.jsx';
import PinProvider from './context/PinProvider.jsx';
import NotificationsProvider from './context/NotificationsProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext>
    <PinProvider>
    <NotificationsProvider>
      <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
    </NotificationsProvider>
    </PinProvider>
    </UserContext>
  </StrictMode>,
)
