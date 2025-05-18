import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Providers } from './contexts';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Providers.GlobalProvider>
      <Providers.TaskProvider>
        <StrictMode>
          <App/>
        </StrictMode>
      </Providers.TaskProvider>
    </Providers.GlobalProvider>
    
  </BrowserRouter>
  
)
