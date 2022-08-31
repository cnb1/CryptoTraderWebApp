import React, { useEffect } from "react";
import gql from "graphql-tag";
import { useQuery, useSubscription } from "@apollo/client";
import PriceSub from './PriceSub';
import Chart from "chart.js/auto";
import '../styles/PriceChart.css'

import { Line } from "react-chartjs-2";

function PriceChart({ items: { portfolioId } }) {

    const {
        loading,
        error,
        data: { getPortfolio: portfolio } = {},
    } = useQuery(GET_PORTFOLIO, {
        update(cache, result) {
        },
        variables: {
            portfolioId,
        },
    });

    const CHART_COLORS = {
        red: 'rgb(69, 2, 2)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(2, 54, 28)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(56, 56, 56)'
    };

    const options = {
        responsive: true,
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true
            }
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 20
                    }
                }
            },
            title: {
                fontSize:40,
                display: false,
                text: "Balance",
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 30
                    }
                }
            },
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontSize: 40
                }
            }],
            x: {
                ticks: {
                    font: {
                      size: 20
                    }
                  },
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      size: 25
                    }
                  }
            },
            y: {
                ticks: {
                    font: {
                      size: 20
                    }
                  },
                  title: {
                    display: true,
                    text: 'Amount in USD',
                    font: {
                      size: 25
                    }
                  },
                grid: {
                    drawBorder: false,
                    color: function (context) {
                        if (context.tick.value > 0) {
                            return CHART_COLORS.red;
                        } else if (context.tick.value < 0) {
                            return CHART_COLORS.red;
                        }
                        return '#000000';
                    },
                }
            }
        }
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
                <h1 className="title-name">Balance</h1>
                <Line data={data} options={options} />
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
    subscription addPrice {
    addPrice {
       id
       username
       strategy
       createdAt
       valueHistory {
           id
           date
           price
       }
    }
}
`;
export default PriceChart;
