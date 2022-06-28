import React, { useState } from "react";
import gql from "graphql-tag";
import { Form, Button, Dropdown } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { useForm } from "../util/hooks";

function UpdateStrategy({
  items: { id, username, strategies, userportfolio },
}) {
  const [state, setState] = useState(true);
  const [errors, setErrors] = useState({});
  const portfolioId = userportfolio;

  const { onChange, onSubmit, values } = useForm(handleClick, {
    strategy: "",
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
    update(cache, result) {
      const data = cache.readQuery({
        query: GET_PORTFOLIO,
        variables: { portfolioId },
      });

      cache.writeQuery({
        query: GET_PORTFOLIO,
        variables: { portfolioId },
        data,
      });
    },
    onError(err) {
      setErrors(err);
    },
    variables: values,
  });

  function handleClick(strategy) {
    console.log("printing strategy");
    console.log(strategy);
    console.log(values);
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
      <h2>Portfolio : {portfolio.strategy}</h2>
      <Form onSubmit={onSubmit}>
        <fieldset>
          <Form.Group className="mb-3">
            <Form.Select onChange={({ target: { value } }) => callback(value)}>
              <option label="Select Strategy"></option>
              {strategies &&
                strategies.map((strat) => (
                  <option key={strat.id} name="strategy" value={strat.strategy}>
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
  );
}

const UPDATE_STRATEGY = gql`
  mutation UpdateStrategy($strategy: String!, $portfolioId: ID!) {
    updateStrategy(strategy: $strategy, portfolioId: $portfolioId) {
      id
      username
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

export default UpdateStrategy;
