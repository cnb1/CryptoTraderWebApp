import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import "../styles/StartTrading.css";

function StartTrading({ items: { id, username, userportfolio } }) {
  const [state, setState] = useState(-1.0);
  const portfolioId = userportfolio;
  const { onSubmit } = useForm(handleClick);

  const {
    // loading,
    // error,
    data: { getPortfolio: portfolio } = {},
  } = useQuery(GET_PORTFOLIO, {
    variables: {
      portfolioId,
    },
    skip: !portfolioId,
  });

  async function handleClick() {
    console.log("handling money click");
    console.log(state);
    console.log(portfolio.value);
    /*  
        make request to start the program
    */
    if (state >= 1000000 && state<= portfolio.value) {
      var data = await fetch("http://localhost:8080/start", {
        // Enter your IP address here
        method: "POST",
        body: JSON.stringify({
          userid: id,
          strategy: portfolio.strategy,
          money: Number(state)
        }),
      })
        .then(function (response) {
          const data = response.json();
          return data;
        })
        .then((data) => {
          console.log("Printing the messages returning")
          console.log(data)
          console.log(data.success)
          return data
        })
        .catch(function (error) {
          console.log(error);
        });

        if (data.success) {
          console.log("successful adding")
          var message = "User " + username + " was added"
          alert(message)
        }
        else {
          console.log("not successful")
          var message = "User " + username + " is already trading"
          alert(message)
        }

    } else {
      if (state < 1000000) {
        alert("Amount needs to be over 1 million");
      }
      else if (state > portfolio.value) {
        alert("Amount needs to be less that the portfolio value")
      }
      else {
        console.log("dont call start");
      }
    }
  }

  function callback(value) {
    if (!isNaN(parseFloat(value))) {
      // console.log("its a float: ", parseFloat(value));

      // console.log("it is a number");
      if (value > 0) {
        value = parseFloat(value).toFixed(2)
        setState(value);
      } else {
        setState(-1);
      }
    } else {
      // console.log("it is not a number");
      setState(-1);
    }
  }

  function handleStop() {
    console.log("handle the stopping");
    fetch("http://localhost:8080/stop", {
      // Enter your IP address here
      method: "POST",
      body: JSON.stringify({
        userid: id,
      }),
    })
      .then(function (response) {
        const data = response.json();
        return data;
      })
      .then((data) => {
        console.log(data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="formLabel">Amount to start trading</Form.Label>
          <Form.Control
            onChange={({ target: { value } }) => callback(value)}
            placeholder="Enter amount"
          />
        </Form.Group>

        <Button type="submit" className="startButton">
          Start
        </Button>
        <Button variant="danger" onClick={handleStop} className="stopButton">
          Stop
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
