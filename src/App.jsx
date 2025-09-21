import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Manager from "./pages/Manager";
import Capo from "./pages/Capo";
import Direzione from "./pages/Direzione";
export default function App(){
  return (<Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/manager' element={<Manager/>}/>
    <Route path='/capo' element={<Capo/>}/>
    <Route path='/direzione' element={<Direzione/>}/>
    <Route path='*' element={<Navigate to='/' replace/>}/>
  </Routes>);
}
