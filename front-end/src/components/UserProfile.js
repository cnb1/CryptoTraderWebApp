import React, { useState } from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Form, Button, Dropdown } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import UpdateStrategy from "./UpdateStrategy";
import AddStrategy from "./AddStrategy";

function UserProfile({ user: { id, username, email, userportfolio } }) {
  const portfolioId = userportfolio;
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(true);

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

  const {
    loadingstrat,
    errorstrat,
    data: { getStrategys: strategies } = {},
  } = useQuery(GET_STRATEGIES);

  return (
    <>
      <h1>Hello : {username}</h1>

      {portfolio ? (
        <>
          <UpdateStrategy
            items={{
              id,
              username,
              strategies,
              userportfolio,
            }}
          />
        </>
      ) : (
        <AddStrategy
          items={{
            id,
            username,
            strategies,
            userportfolio,
          }}
        />
      )}
    </>
  );
}

const GET_STRATEGIES = gql`
  query GetStrategys {
    getStrategys {
      id
      strategy
    }
  }
`;

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      id
      username
      strategy
    }
  }
`;

export default UserProfile;
