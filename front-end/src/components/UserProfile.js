import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import UpdateStrategy from "./UpdateStrategy";
import AddStrategy from "./AddStrategy";
import PriceChart from "./PriceChart";

import "../styles/UserProfile.css";
import StartTrading from "./StartTrading";

function UserProfile({ user: { id, username, email, userportfolio } }) {
  const portfolioId = userportfolio;
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(true);

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

  const {
    loadingstrat,
    errorstrat,
    data: { getStrategys: strategies } = {},
  } = useQuery(GET_STRATEGIES);

  return (
    <>
      <div className="userProfileParent">
        {portfolio ? (
          <>
            <div className="float-container">
              <div className="float-child">
                <div className="shadow-lg p-3 mb-5 bg-white rounded">
                  <UpdateStrategy
                    items={{
                      id,
                      username,
                      strategies,
                      userportfolio,
                    }}
                  />
                </div>
              </div>
              <div className="float-child">
                <div className="shadow-lg p-3 mb-5 bg-white rounded">
                  <StartTrading />
                </div>
              </div>
            </div>
            <PriceChart items={{ portfolioId }} />
          </>
        ) : (
          <AddStrategy
            items={{
              id,
              username,
              strategies,
              userportfolio,
            }}
          />
        )}
      </div>
    </>
  );
}

const GET_STRATEGIES = gql`
  query GetStrategys {
    getStrategys {
      id
      strategy
    }
  }
`;

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      id
      username
      strategy
    }
  }
`;

export default UserProfile;
