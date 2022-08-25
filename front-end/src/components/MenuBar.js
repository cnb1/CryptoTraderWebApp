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
  var portfolioId = null
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

  if (usercurrent.userportfolio != null) {
    portfolioId = usercurrent.userportfolio

    const {
      loading,
      error,
      data: { getPortfolio: portfolio } = {},
    } = useQuery(GET_PORTFOLIO, {
      variables: {
        portfolioId,
      },
      skip: !portfolioId,
    });
  }

  const handleClick = (e) => {
    navigate("/");
  };

  console.log("user is : ", userId);
  console.log("-----------");
  if (usercurrent) {
    console.log("user portfolio is ", usercurrent.userportfolio);
  }

  const menuBar =
    user && usercurrent ? (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Collapse className="title2">
            <Navbar.Brand href="/" onClick={handleClick} className="title">
              Crypto Trader
            </Navbar.Brand>
          </Navbar.Collapse>

          {/* enter dynamic username and money and strategy selected feature
            show all three
        */}
          {portfolio ? (
            <Container>
              <Navbar.Text>{portfolio.username}</Navbar.Text>
              <Navbar.Text>{portfolio.strategy}</Navbar.Text>
              <Navbar.Text>{portfolio.value}</Navbar.Text>
            </Container>
          ) : (
            console.log("port false")
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
      valueHistory {
        id
        price
        date
      }
    }
  }
`;

export default MenuBar;
