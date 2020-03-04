import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Router from './Routes';

const QUERY = gql`
  {
    isLoggedIn @client
  }
`;

function App() {

  const { data: { isLoggedIn } } = useQuery(QUERY);

  return (
    <Router isLoggedIn={isLoggedIn} />
  );
}

export default App;
