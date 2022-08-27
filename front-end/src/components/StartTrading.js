import React from "react";
import { Form, Button} from "react-bootstrap";
import { useForm } from "../util/hooks";



function StartTrading() {
  const { onChange, onSubmit, values } = useForm(
    handleClick,
    {
      money: 0,
    }
  );

  function handleClick() {
    console.log("handling money click");
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Amount to start trading</Form.Label>
          <Form.Control placeholder="Enter amount" />
        </Form.Group>

        <Button type="submit" className="startButton">
          Start
        </Button>
      </Form>
    </>
  );
}

export default StartTrading;
