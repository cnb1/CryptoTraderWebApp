import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import '../styles/Home.css';

import Login from './Login';

function Home() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  
  const handleClick = (e) => {
      navigate('/'+e);
  };


  const home = user ? (
    <h1>{user.username}</h1>
  ) : (
    <>
      <div className='homediv'> 
        <Button variant="primary" size="lg" className='button-custom' onClick={() => handleClick('login')}>
          Login
        </Button>
        <br></br>
        <br></br>
        <Button variant="secondary" size="lg" className="button-custom" onClick={() => handleClick('register')}>
          Register
        </Button>
      </div>
    </>
  );

  return home;
}

export default Home;
