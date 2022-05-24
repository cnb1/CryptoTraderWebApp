import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Button } from "react-bootstrap";
import './Home.css';

function Home() {
  const { user, logout } = useContext(AuthContext);

  const home = user ? (
    <h1>{user}</h1>
  ) : (
    <>
      <div className='homediv'> 
        <Button variant="primary" size="lg" className='button-custom'>
          Login
        </Button>
        <br></br>
        <br></br>
        <Button variant="secondary" size="lg" className="button-custom">
          Large button
        </Button>
      </div>
    </>
  );

  return home;
}

export default Home;
