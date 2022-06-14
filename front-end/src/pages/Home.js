import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

import "../styles/Home.css";

function Home() {
  const { user, logout } = useContext(AuthContext);

  if (user) {
    // console.log('printing user in home');
    // console.log(user);
  }

  const portfolioId = user;

  if (portfolioId) {
    // console.log("portfolio id:" + portfolioId.userportfolio);
  }

  const {
    loading,
    error,
    data: { getPortfolio: portfolio } = {},
  } = useQuery(GET_PORTFOLIO, {
    variables: {
      portfolioId : "6275efc28691e1ef83739ef2"
    },
  });

  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate("/" + e);
  };

  const home = user ? (
    <>
    {
      portfolio ? (
        <h2>portfolio found {portfolio.strategy}</h2>
      ) : (
        <h2>portfolio not found</h2>
      )
}
    </>
  ) : (
    <>
      <div className="homediv">
        <Button
          variant="primary"
          size="lg"
          className="button-custom"
          onClick={() => handleClick("login")}
        >
          Login
        </Button>
        <br></br>
        <br></br>
        <Button
          variant="secondary"
          size="lg"
          className="button-custom"
          onClick={() => handleClick("register")}
        >
          Register
        </Button>
      </div>
    </>
  );

  return home;
}

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      username
      strategy
    }
  }
`;

export default Home;
