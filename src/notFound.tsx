import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { NotFound } from './components/NotFound.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotFound />
  </StrictMode>,
)
