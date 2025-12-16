import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/pages/Login'
import WelcomePage from './components/pages/WelcomePage'
import Register from './components/pages/Register'
import Dashboard from './components/pages/Dashboard'
import ProductDetails from './components/pages/ProductDetails'
import Chatbot from './components/pages/Chatbot'
import { api } from './services/api'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
