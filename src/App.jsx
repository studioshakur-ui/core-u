import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Capo from './pages/Capo.jsx'
import { RequireAuth, RoleRouter } from './components/AuthGate.jsx'

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/capo"
          element={
            <RequireAuth>
              <RoleRouter>
                <Capo />
              </RoleRouter>
            </RequireAuth>
          }
        />

        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}
