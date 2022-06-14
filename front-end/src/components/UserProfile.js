import React from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

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
      {portfolio ? (
        <>
          <h2>portfolio found {portfolio.strategy}</h2>
          <h2>portfolio found {portfolio.username}</h2>
        </>
      ) : (
        <h2>portfolio not found</h2>
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