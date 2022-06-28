import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

import "../styles/Home.css";
import UserProfile from '../components/UserProfile';

function Home() {
  const { user, logout } = useContext(AuthContext);

  const userId = user ? user.id : null;

  const {
    loadinguser,
    erroruser,
    data: { getUser: usercurrent } = {},
  } = useQuery(GET_USER, {
    variables: {
      userId
    },
    skip: (userId === null)
  });

  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate("/" + e);
  };


  if (user && !usercurrent) {
    return <h1>Loading...</h1>;
  } else {

    const home = user ? (
      <UserProfile user={usercurrent} />
    ) : (
      <>
          <div className="homediv">
            <div className="shadow-lg p-3 mb-5 bg-white rounded">
              <Button
                variant="primary"
                size="lg"
                className="button-custom"
                onClick={() => handleClick("login")}
              >
                Login
              </Button>
              <br></br>
              <br></br>
              <Button
                variant="secondary"
                size="lg"
                className="button-custom"
                onClick={() => handleClick("register")}
              >
                Register
              </Button>
            </div>
          </div>


      </>
    );

    return home;
  }
}

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

export default Home;
