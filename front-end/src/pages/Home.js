import React, { useContext } from "react";
import { AuthContext } from "../context/auth";

function Home() {
  const { user, logout } = useContext(AuthContext);

  const home = user ? (
    <h1>{user}</h1>
  ) : (
    <>
      <h1>login</h1>
      <h1>register</h1>
    </>
  );

  return home;
}

export default Home;
