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

  const { onChange, onSubmit, values } = useForm(handleClick, {
    strategy: "",
    portfolioId: portfolioId,
  });

  const [updateStrategy, { loadingupdate }] = useMutation(UPDATE_STRATEGY, {
    update(cache, result) {
        console.log("beggining")
        console.log(result)
      const data = cache.readQuery({
        query: GET_PORTFOLIO,
        variables: { portfolioId },
      });
      console.log(data)
      console.log("end")



      cache.writeQuery({
        query: GET_PORTFOLIO,
        // data : {getPortfolio : [result.data.updateStrategy.strategy, ...data.getPortfolio]},
      });
      {
        console.log("printing cache update");
        console.log(data);
      }
    },
    onError(err) {
      setErrors(err);
    },
    variables: values,
  });

  const {
    loadingstrat,
    errorstrat,
    data: { getStrategys: strategies } = {},
  } = useQuery(GET_STRATEGIES);

  function handleClick(strategy) {
    updateStrategy();
  }

  function callback(value) {
    if (value !== "") {
      console.log("setting new strategy");
      values.strategy = value;
      setState(false);
    } else {
      setState(true);
    }
  }

  return (
    <>
      <h1>Hello : {username}</h1>

      {portfolio ? (
        <>
          <h2>Portfolio : {portfolio.strategy}</h2>
          <Form onSubmit={onSubmit}>
            <fieldset>
              <Form.Group className="mb-3">
                <Form.Select
                  onChange={({ target: { value } }) => callback(value)}
                >
                  <option label="Select Strategy"></option>
                  {strategies &&
                    strategies.map((strat) => (
                      <option
                        key={strat.id}
                        name="strategy"
                        value={strat.strategy}
                      >
                        {strat.strategy}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Button type="submit" disabled={state}>
                Update Strategy
              </Button>
            </fieldset>
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
      id
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
      id
      username
      strategy
    }
  }
`;

export default UserProfile;
