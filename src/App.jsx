import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Capo from "./pages/Capo";
import Manager from "./pages/Manager";
import Direzione from "./pages/Direzione";
import ResetPassword from "./pages/ResetPassword";
import Static from "./pages/Static";
export default function App(){
  return (<Routes>
    <Route path='/login' element={<Login/>}/>
    <Route path='/reset-password' element={<ResetPassword/>}/>
    <Route path='/legal' element={<Static title={'Legal'}/>}/>
    <Route path='/privacy' element={<Static title={'Privacy'}/>}/>
    <Route path='/cookies' element={<Static title={'Cookies'}/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/capo' element={<Capo/>}/>
    <Route path='/manager' element={<Manager/>}/>
    <Route path='/direzione' element={<Direzione/>}/>
    <Route path='*' element={<Navigate to='/' replace/>}/>
  </Routes>);
}
