// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import "stream-chat-react/dist/css/v2/index.css";
import './index.css'
import App from './routes/index'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SocketContextProvider } from "./context/SocketContext";


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketContextProvider> 
                <App />
            </SocketContextProvider>
    </QueryClientProvider>
      
  </React.StrictMode>
)