import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRoute from "./pages/AuthRoute";

function App() {
  return (
      <AuthProvider>
        <Router>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Home />} />

            <Route exact path="/login" element={<AuthRoute />}>
              <Route exact path="/login" element={<Login />} />
            </Route>

            <Route exact path="/register" element={<AuthRoute />}>
              <Route exact path="/register" element={<Register />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
