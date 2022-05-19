import './App.css';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';



function App() {

  const portfolioId = "627b2904540cad842811ad42"; 

  const {
    loading,
    error, 
    data
  } = useQuery(FETCH_PORTFOLIO, {
    variables: { portfolioId },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;



  return (
    <div className="App">
      <h1>HEllo</h1>
      {console.log(data)}
      <h2>{data.getPortfolio.username}</h2>
      <h2>{data.getPortfolio.strategy}</h2>
      {data.getPortfolio.valueHistory.map(pricetemp => (
        <div key = {pricetemp.id}>
          <h3>{pricetemp.price}</h3>
          <h3>{pricetemp.date}</h3>
        </div> 
      ))}
    </div>
  );
}

const FETCH_PORTFOLIO = gql`
  query getPortfolio($portfolioId: ID!) {
    getPortfolio(portfolioId : $portfolioId) {
      id
      username
      strategy
      valueHistory {
        id
        price
        date
      }
    }
  }
`;

export default App;
