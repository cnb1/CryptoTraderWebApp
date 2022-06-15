import React, { useState } from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Form, Button, Dropdown } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";

function UserProfile({ user: { id, username, email, userportfolio } }) {
  const portfolioId = userportfolio;
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(handleClick, {
    strategy: "www",
    portfolioId: portfolioId,
  });

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

  const [updateStrategy, { loadingupdate }] = useMutation(UPDATE_STRATEGY, {
    update(cache, { data: { updateStrategy: updatedStrategy } }) {
        const data = cache.readQuery({
            query: GET_PORTFOLIO,
            variables: {portfolioId}
        });

        cache.writeQuery({ 
            query: GET_PORTFOLIO,
            data: {getPortfolio: [data.updateStrategy, ...data.getPortfolio]}
        });
        {console.log(data)}
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const {
    loadingstrat,
    errorstrat,
    data: { getStrategys: strategies } = {},
  } = useQuery(GET_STRATEGIES);

  function handleClick() {
    console.log("clicked RSI");
    console.log(values);
    updateStrategy();
  }

  return (
    <>
      <h1>Hello : {username}</h1>

      {portfolio ? (
        <>
          <h2>Portfolio : {portfolio.strategy}</h2>
          <Form onSubmit={onSubmit}>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Change Portfolio
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {strategies &&
                  strategies.map((strat) => (
                    <Dropdown.Item
                      key={strat.id}
                      label="strategy"
                      name="strategy"
                      onChange={onChange}
                      value={strat.strategy}
                    >
                      {strat.strategy}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </>
      ) : (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Add Portfolio
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {strategies &&
              strategies.map((strat) => (
                <Dropdown.Item
                  key={strat.id}
                  onClick={() => handleClick(strat.strategy)}
                >
                  {strat.strategy}
                </Dropdown.Item>
              ))}
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

const GET_STRATEGIES = gql`
  query GetStrategys {
    getStrategys {
      id
      strategy
    }
  }
`;

const UPDATE_STRATEGY = gql`
  mutation UpdateStrategy($strategy: String!, $portfolioId: ID!) {
    updateStrategy(strategy: $strategy, portfolioId: $portfolioId) {
      username
      strategy
    }
  }
`;

export default UserProfile;
