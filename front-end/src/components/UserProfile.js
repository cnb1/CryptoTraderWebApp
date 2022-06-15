import React, {useState} from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Button, Dropdown } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { useForm } from "../util/hooks";

function UserProfile({ user: { id, username, email, userportfolio } }) {
  const portfolioId = userportfolio;
  const [errors, setErrors] = useState({});


  const { onChange, onClick, values } = useForm(handleClick, {
    strategy: "",
    portfolioId: portfolioId
  });

  const {
    loading,
    error,
    data: { getPortfolio: portfolio } = {},
  } = useQuery(GET_PORTFOLIO, {
    variables: {
      portfolioId,
    },
    skip: !portfolioId,
  });

  const [updateStrategy, { loadingupdate }] = useMutation(UPDATE_STRATEGY, {
    update(_, { data: { updateStrategy: updatedStrategy } }) {},
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const {
    loadingstrat,
    errorstrat,
    data: { getStrategys: strategies } = {},
  } = useQuery(GET_STRATEGIES);

  function handleClick(strategy) {
    console.log("clicked RSI");
    console.log(strategy);
    updateStrategy();
  }

  return (
    <>
      <h1>Hello : {username}</h1>

      {portfolio ? (
        <>
          <h2>Portfolio : {portfolio.strategy}</h2>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Change Portfolio
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {strategies &&
                strategies.map((strat) => (
                  <Dropdown.Item
                    key={strat.id}
                    onClick={handleClick(strat.strategy)}
                  >
                    {strat.strategy}
                  </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        </>
      ) : (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Add Portfolio
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {strategies &&
              strategies.map((strat) => (
                <Dropdown.Item
                  key={strat.id}
                  onClick={() => handleClick(strat.strategy)}
                >
                  {strat.strategy}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      username
      strategy
    }
  }
`;

const GET_STRATEGIES = gql`
  query GetStrategys {
    getStrategys {
      id
      strategy
    }
  }
`;

const UPDATE_STRATEGY = gql`
  mutation UpdateStrategy($strategy: String!, $portfolioId: ID!) {
    updateStrategy(strategy: $strategy, portfolioId: $portfolioId) {
      username
      strategy
    }
  }
`;

export default UserProfile;
