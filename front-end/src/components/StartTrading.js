import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

function StartTrading({ items: { id, username, userportfolio } }) {
  const [state, setState] = useState(-1);
  const portfolioId = userportfolio;
  const { onSubmit } = useForm(handleClick);

  const {
    // loading,
    // error,
    data: { getPortfolio: portfolio } = {},
  } = useQuery(GET_PORTFOLIO, {
    update(cache, result) {},
    variables: {
      portfolioId,
    },
    skip: !portfolioId,
  });

  function handleClick(amount) {
    console.log("handling money click");
    console.log(state);
    /*  
        make request to start the program
    */
    if (state >= 1000000) {
      console.log("call start trading for user", id);
      console.log(
        "user information is strategy is : ",
        portfolio.strategy,
        " value is ",
        portfolio.value
      );

      var resp = fetch("http://localhost:8080/start", {
        // Enter your IP address here
        method: "POST",
        body: JSON.stringify({
          userid: id,
          strategy: portfolio.strategy,
          money: portfolio.value,
        }),
      })
        .then(function (response) {
          const data = response.json();
          console.log("data: ", data);
          return data;
        })
        .then((data) => {
          console.log(data.message);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      alert("Amount needs to be over 1 million");
      console.log("dont call start");
    }
  }

  function callback(value) {
    let isnum = /^\d+$/.test(value);

    if (isnum) {
      console.log("it is a number");
      if (value > 0) {
        setState(value);
      } else {
        setState(-1);
      }
    } else {
      console.log("it is not a number");
      setState(-1);
    }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Amount to start trading</Form.Label>
          <Form.Control
            onChange={({ target: { value } }) => callback(value)}
            placeholder="Enter amount"
          />
        </Form.Group>

        <Button type="submit" className="startButton">
          Start
        </Button>
      </Form>
    </>
  );
}

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      id
      username
      strategy
      value
    }
  }
`;

export default StartTrading;
