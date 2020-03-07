import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Router from './Routes';
import Loader from './Loader';

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

const LOADING = gql`
  {
    loading @client
  }
`;

function App() {

  const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN);
  const { data: { loading } } = useQuery(LOADING);

  return (
    <React.Fragment>
      { loading && <Loader /> }
      <Router isLoggedIn={isLoggedIn} />
    </React.Fragment>
  );
}

export default App;
