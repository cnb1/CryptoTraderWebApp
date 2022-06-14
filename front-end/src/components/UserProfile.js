import React from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Button, Dropdown } from "react-bootstrap";


function UserProfile({ user: { id, username, email, userportfolio } }) {

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
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Change Portfolio
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      ) : (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Add Portfolio
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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