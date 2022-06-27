import React, { useState } from "react";
import { useForm } from "../util/hooks";
import { Form, Button, Dropdown } from "react-bootstrap";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

function AddStrategy({ items: { id, username, strategies, userportfolio } }) {
  const [state, setState] = useState(true);
  const [errors, setErrors] = useState({});
  // const [statePortfolio, setState] = useState(true);

  console.log("user portfolio->" + userportfolio)

  const navigate = useNavigate();

  const { onChange, onSubmit, values } = useForm(handleClick, {
    userId: id,
    username: username,
    strategy: "",
    userportfolio: userportfolio,
  });

  const {
    loadinguser,
    erroruser,
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
        console.log("result is -> " + result)
        console.log(result.data.createUserPortfolio.id)
        console.log(createUserPortfolio.id)
        const data = cache.readQuery({
          query: GET_USER,
          variables: { userId: values.userId },
        });
        console.log("updating user port in cache")
        console.log(data);

        const datatemp = {
          email: data.getUser.email,
          id : data.getUser.id,
          username: data.getUser.username,
          userportfolio: result.createUserPortfolio.id
        }

        cache.writeQuery({
          query: GET_USER,
          variables: { userId: values.userId },
          datatemp
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
        },
      },
    }
  );

  function handleClick(strategy) {
    console.log("printing strategy");
    console.log(strategy);
    console.log(values);
    createUserPortfolio();
  }

  function callback(value) {
    if (value !== "") {
      console.log("setting new add strat setting");
      values.strategy = value;
      setState(false);
    } else {
      setState(true);
    }
  }

  return (
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
          Add Strategy
        </Button>
      </fieldset>
    </Form>
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
