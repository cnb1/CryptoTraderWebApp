import React, { useContext } from "react";
import { Navbar, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/MenuBar.css";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);

  const userId = user ? user.id : null;
  const navigate = useNavigate();

  const {
    loadinguser,
    erroruser,
    data: { getUser: usercurrent } = {},
  } = useQuery(GET_USER, {
    variables: {
      userId,
    },
    skip: userId === null,
  });
  const portfolioId = usercurrent?.userportfolio;

  const {
    loading,
    error,
    data: { getPortfolio: portfolio } = {},
  } = useQuery(GET_PORTFOLIO, {
    update(cache, result) {},
    variables: {
      portfolioId,
    },
    skip: !portfolioId,
  });

  const handleClick = (e) => {
    navigate("/");
  };

  const format = (amount) => {
    return Number(amount)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const menuBar =
    user && usercurrent ? (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Collapse className="title2">
            <Navbar.Brand href="/" onClick={handleClick} className="title">
              Hunting αlpha
            </Navbar.Brand>
          </Navbar.Collapse>

          {/* enter dynamic username and money and strategy selected feature
            show all three
        */}
          {portfolio ? (
            <Container className="userinfo">
              <Navbar.Text>
                User : {portfolio.username.toUpperCase()}
              </Navbar.Text>
              <br></br>
              <Navbar.Text>
                Strategy : {portfolio.strategy.toUpperCase()}
              </Navbar.Text>
              <br></br>
              <Navbar.Text><h4 className="money">Account Value : ${format(portfolio.value)}</h4></Navbar.Text>
            </Container>
          ) : (
            <Container className="userinfo">
              <Navbar.Text>
                No Portfolio for User : {usercurrent.username.toUpperCase()}
              </Navbar.Text>
            </Container>
          )}

          <Button className="button-logout" name="Logout" onClick={logout}>
            Logout
          </Button>
        </Container>
      </Navbar>
    ) : (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/" onClick={handleClick} className="title">
            Crypto Trader
          </Navbar.Brand>
        </Container>
      </Navbar>
    );

  return menuBar;
}

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      userportfolio
    }
  }
`;

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      id
      username
      strategy
      value
    }
  }
`;

export default MenuBar;
