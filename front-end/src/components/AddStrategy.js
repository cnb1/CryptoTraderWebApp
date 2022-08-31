import React, { useState } from "react";
import { useForm } from "../util/hooks";
import { Form, Button } from "react-bootstrap";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

function AddStrategy({ items: { id, username, strategies, userportfolio } }) {
  const [state, setState] = useState(true);
  const [stateAmount, setStateAmount] = useState(true);
  const [stateAmountValue, setStateAmountValue] = useState(0);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { onChange, onSubmit, values } = useForm(handleClick, {
    userId: id,
    username: username,
    strategy: "",
    userportfolio: userportfolio,
    value: 1000000
  });

  const {
    // loadinguser,
    // erroruser,
    data: { getUser: usercurrent } = {},
  } = useQuery(GET_USER, {
    variables: {
      userId: values.userId,
    },
  });

  const [createUserPortfolio, { loadingupdate }] = useMutation(
    CREATE_USER_PORTFOLIO,
    {
      update(cache, result) {
        const data = cache.readQuery({
          query: GET_USER,
          variables: { userId: values.userId },
        });

        cache.writeQuery({
          query: GET_USER,
          variables: { userId: values.userId },
          data: {
            getUser: {
              id: data.getUser.id,
              username: data.getUser.username,
              email: data.getUser.email,
              userportfolio: result.data.createUserPortfolio.id,
            },
          },
        });

        navigate("/");
      },
      onError(err) {
        setErrors(err);
      },
      variables: {
        userPortfolio: {
          userId: values.userId,
          username: values.username,
          strategy: values.strategy,
          value: parseFloat(stateAmountValue)
        },
      },
    }
  );

  function handleClick(strategy) {
    console.log("create u.p.")
    createUserPortfolio();
  }

  function callback(value) {
    if (value !== "") {
      console.log("setting new add strat setting");
      values.strategy = value;
      setStateAmount(false);
    } else {
      setState(true);
    }
  }

  function callbackAmount(value) {
    if (value > 1000000) {
      console.log(value)
      setState(false)
      setStateAmount(false)
      setStateAmountValue(value)
    }
  }

  return (
    <>
      <br></br>
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

          <Form.Group className="mb-3">
            <Form.Label>Amount to Trade</Form.Label>
            <Form.Control disabled={stateAmount}
              onChange={({ target: { value } }) => callbackAmount(value)}
              placeholder="Enter amount to trade above 1 million or 1 million will be set"
            />
          </Form.Group>
          <Button type="submit" disabled={state || stateAmount}>
            Add Strategy
          </Button>
        </fieldset>
      </Form>
    </>
  );
}

const CREATE_USER_PORTFOLIO = gql`
  mutation CreateUserPortfolio($userPortfolio: PortfolioInput) {
    createUserPortfolio(userPortfolio: $userPortfolio) {
      username
      strategy
      id
    }
  }
`;

const GET_USER = gql`
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      username
      email
      userportfolio
    }
  }
`;

export default AddStrategy;
