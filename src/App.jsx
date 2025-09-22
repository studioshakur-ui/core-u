import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Capo from './pages/Capo.jsx'
import Manager from './pages/Manager.jsx'
import Direzione from './pages/Direzione.jsx'
import ImportExcel from './pages/ImportExcel.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Toasts from './components/Toasts.jsx'
export default function App(){
  return (<div className="min-h-screen bg-core-bg text-white">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/capo" element={<ProtectedRoute allowed={['capo']}><Capo/></ProtectedRoute>}/>
      <Route path="/manager" element={<ProtectedRoute allowed={['manager']}><Manager/></ProtectedRoute>}/>
      <Route path="/direzione" element={<ProtectedRoute allowed={['direzione']}><Direzione/></ProtectedRoute>}/>
      <Route path="/import" element={<ProtectedRoute allowed={['manager','direzione']}><ImportExcel/></ProtectedRoute>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
    <Toasts/>
  </div>)
}
