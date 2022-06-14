import React, { useContext, useState } from "react";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

function Register() {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { registerUser: userData } }) {
      context.login(userData);
      navigate("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function registerUser() {
    console.log("execute register user");
    addUser();
  }

  return (
    <>
      <h1>Register page</h1>

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            label="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={values.username}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            label="email"
            name="email"
            type="text"
            placeholder="Enter email"
            value={values.email}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            label="password"
            placeholder="Password.."
            name="password"
            type="password"
            value={values.password}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            label="confirmPassword"
            placeholder="Password.."
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={onChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    registerUser(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
      userportfolio
    }
  }
`;

export default Register;
