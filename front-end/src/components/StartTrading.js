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
    console.log(state)
    /*  
        make request to start the program
    */
  }

  function callback(value) {
    let isnum = /^\d+$/.test(value)

    if (isnum) {
        console.log('it is a number')
        if (value > 0) {
            setState(value)
        }
        else {
            setState(-1)
        }
    }
    else {
        console.log('it is not a number')
        setState(-1)
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
