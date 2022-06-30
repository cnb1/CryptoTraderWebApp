import React from "react";
import gql from "graphql-tag";
import { useQuery, useSubscription } from "@apollo/client";
import Chart from "chart.js/auto";

import { Line } from "react-chartjs-2";

function PriceChart({ items: { portfolioId } }) {
    console.log(portfolioId);

    // const {datasub2, loadingsub2} = useSubscription(
    //     PRICE_SUBSCRIPTION,
    //     {
    //         onSubscriptionData: () => {
    //             console.log('message revcieved')
    //         }
    //     }
    // ) 


    const {
        loading,
        error,
        subscribeToMore,
        data: { getPortfolio: portfolio } = {},
    } = useQuery(GET_PORTFOLIO, {
        update(cache, result) {
            console.log("result");
            console.log(result);
        },
        variables: {
            portfolioId,
        },
    });

    subscribeToMore({
        document: PRICE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
 
            console.log('message to console');
        }
    })

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
            },
            title: {
                display: true,
                text: "Balance",
            },
        },
    };

    if (portfolio) {
        const labels = portfolio.valueHistory.map((x) =>
            new Date(parseInt(x.date)).toLocaleDateString()
        );

        const data = {
            labels,
            datasets: [
                {
                    label: "Total Amount",
                    data: portfolio.valueHistory.map((x) => x.price),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
            ],
        };

        return (
            <>

                <Line data={data} options={options} />
                <p>
                    subscription test
                </p>
            </>
        );
    } else {
        return <h1>price doesnt exitsts</h1>;
    }
}

const GET_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId: $portfolioId) {
      id
      valueHistory {
        id
        price
        date
      }
    }
  }
`;

const PRICE_SUBSCRIPTION = gql`
    subscription newPrice {
    newPrice {
        id
        username
        valueHistory {
        date
        price
        }
    }
}
`;
export default PriceChart;
