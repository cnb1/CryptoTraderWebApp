import React, { useState,  useEffect } from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import Chart from 'chart.js/auto';


import { Line } from 'react-chartjs-2';

function PriceChart({ items: { portfolioId } }) {


    console.log(portfolioId)
    const {
        loading,
        error,
        data: { getPortfolio: portfolio } = {},
    } = useQuery(GET_PORTFOLIO, {
        update(cache, result) {
            console.log(result)
        },
        variables: {
            portfolioId
        }
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    if (portfolio) {
        const labels = portfolio.valueHistory.map(x => new Date(parseInt('1651896258023')).toLocaleDateString());

        const data = {
            labels,
            datasets: [
                {
                    label: 'Total Amount',
                    data: portfolio.valueHistory.map(x => x.price),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };
        // console.log(data.datasets[0].data)

        return (
            <Line data={data} options={options} />
            // <h1>price exists</h1>
        )
    }
    else {
        return (<h1>price doesnt exitsts</h1>);
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

export default PriceChart;