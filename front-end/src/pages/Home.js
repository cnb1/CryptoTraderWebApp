import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

import "../styles/Home.css";

function Home() {
  const { user, logout } = useContext(AuthContext);

  const userId = user ? user.id : "";
  const isusernull = userId === "" ? true : false;
  console.log("print user");
  console.log(user);
  console.log(userId);
  console.log(isusernull);

  const {
    loadinguser,
    erroruser,
    data: { getUser: usercurrent } = {},
  } = useQuery(GET_USER, {
    variables: {
      userId,
    },
  });

  const portfolioId = (usercurrent && ('userportfolio' in usercurrent)) ? usercurrent.userportfolio : false;

  const {
    loading,
    error,
    data: { getPortfolio: portfolio } = {},
  } = useQuery(GET_PORTFOLIO, {
    variables: {
      portfolioId
    },
    skip : !portfolioId
  });

  // const portfolioId = usercurrent.userportfolio ===null ? usercurrent.userportfolio : null;
  // const isusercurrentnull = portfolioId  ? true : false;

  // console.log("is user current null")
  // console.log(isusercurrentnull)

  // if (portfolioId) {
  //   // console.log("portfolio id:" + portfolioId.userportfolio);
  // }

  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate("/" + e);
  };


  if (user && !usercurrent) {
    return <h1>Loading...</h1>;

  } else {

    const home = user ? (
      <>
        {portfolio ? (
          <>
            <h2>portfolio found {portfolio.strategy}</h2>
            <h2>portfolio found {portfolio.username}</h2>
          </>
        ) : (
          <h2>portfolio not found</h2>
        )}
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
}

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      username
      strategy
    }
  }
`;

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      userportfolio
    }
  }
`;

export default Home;
