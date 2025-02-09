import React from "react"
import { BrowserRouter, Routes, Route, Redirect } from "react-router"


import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoutes"


function Logout() {
  localStorage.clear();
  return <Redirect to="/login"/>
}

function RegisterAndLogout(){
  localStorage.clear();
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<RegisterAndLogout />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
