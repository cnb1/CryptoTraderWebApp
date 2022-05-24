import React from "react";
import { Navbar, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


function MenuBar() {

  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate('/');
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/" onClick={handleClick}>Crypto Trader</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default MenuBar;
