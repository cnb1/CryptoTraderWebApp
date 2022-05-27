import React, { useContext, useState } from "react";
import gql from "graphql-tag";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import {Form, Button} from 'react-bootstrap';
import { useForm } from '../util/hooks';
import {useMutation} from '@apollo/client';

function Login() {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      console.log('update');
      console.log(userData);
      context.login(userData);
      navigate("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    console.log('hello');
    
    loginUser();

    console.log('hello2')
  } 

  return (
    <>
      <h1>Login page</h1>

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            label='username'
            name='username'
            type="text" 
            placeholder="Enter username" 
            value={values.username}
            onChange={onChange}
            />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            label='password'
            placeholder='Password..'
            name='password'
            type='password'
            value={values.password}
            onChange={onChange} 
            placeholder="Password" />
        </Form.Group>


        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      
    </>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
