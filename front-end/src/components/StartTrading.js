import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "../util/hooks";

function StartTrading() {
  const [state, setState] = useState(-1);

  const { onChange, onSubmit, values } = useForm(handleClick, {
    money: 0,
  });

  function handleClick(amount) {
    console.log("handling money click");
    console.log(state);
    /*  
        make request to start the program
    */
    if (state >= 1000000) {
      console.log("call start");
      fetch("http://localhost:8080/start", {
        // Enter your IP address here
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          userid: "1234",
          strategy: "ma15",
          money: 1000000,
        }),
      });
    } else {
      alert("amount needs to be over 1 million");
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

export default StartTrading;
