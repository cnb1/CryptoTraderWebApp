import React, { useState } from "react";
import gql from "graphql-tag";
import { Form, Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";

import "../styles/UpdateStrategy.css";

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


  const [updateStrategy, { loadingupdate }] = useMutation(UPDATE_STRATEGY, {
    update(cache, result) {
      const data = cache.readQuery({
        query: GET_PORTFOLIO,
        variables: { portfolioId },
        refetchInterval: 1000,
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
    updateStrategy();
  }

  function callback(value) {
    if (value !== "") {
      values.strategy = value;
      setState(false);
    } else {
      setState(true);
    }
  }

  return (
    <>
      <div className="parentstrategy">
        <fieldset>
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="formLabel">Select a new strategy</Form.Label>
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
            </Form>
        </fieldset>

      </div>
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
