import React from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Button } from "react-bootstrap";


function UserProfile( { user: {id, username, email, userportfolio}} ) {

    const portfolioId = userportfolio;
    // console.log(user)
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

  return (
    <>
    <h1>Hello : {username}</h1>
    
      {portfolio ? (
        <>
          <h2>Portfolio : {portfolio.strategy}</h2>
        </>
      ) : (
        <Button>Add Portfolio</Button>
        )}
    </>
  );
}

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      username
      strategy
    }
  }
`;

export default UserProfile;