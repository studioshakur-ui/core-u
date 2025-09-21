import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Manager from "./pages/Manager";
import Capo from "./pages/Capo";
import Direzione from "./pages/Direzione";
import GuardedRoute from "./components/GuardedRoute";
import { useAuthStore } from "./store/useAuthStore";

export default function App(){
  const init = useAuthStore(s => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>

      <Route path='/manager' element={
        <GuardedRoute requireRole='manager'>
          <Manager/>
        </GuardedRoute>
      }/>

      <Route path='/capo' element={
        <GuardedRoute requireRole='capo'>
          <Capo/>
        </GuardedRoute>
      }/>

      <Route path='/direzione' element={
        <GuardedRoute requireRole='direzione'>
          <Direzione/>
        </GuardedRoute>
      }/>

      <Route path='*' element={<Navigate to='/' replace/>}/>
    </Routes>
  );
}
