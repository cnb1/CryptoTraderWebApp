import React, { useContext } from "react";
import { Navbar, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../styles/MenuBar.css'
import { AuthContext } from "../context/auth";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate("/");
  };

  const menuBar = user ? (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Collapse>
          <Navbar.Brand href="/" onClick={handleClick}>
            Crypto Trader
          </Navbar.Brand>
        </Navbar.Collapse>

        <Button className="button-logout" name="Logout" onClick={logout}>
            Logout
        </Button>

      </Container>
    </Navbar>
  ) : (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/" onClick={handleClick}>
          Crypto Trader
        </Navbar.Brand>
      </Container>
    </Navbar>
  );

  return menuBar;
}

export default MenuBar;
