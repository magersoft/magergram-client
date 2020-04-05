import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Router from './Routes';
import { Loader } from './Loader';
import ThemeSwitcher from 'react-css-vars';
import light from '../theme/light';
import dark from '../theme/dark';

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

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

function App() {
  const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN);
  const { data: { loading } } = useQuery(LOADING);
  const { data: { darkMode } } = useQuery(DARK_MODE);

  return (
    <React.Fragment>
      <ThemeSwitcher theme={darkMode ? dark : light} />
      { loading && <Loader /> }
      <Router isLoggedIn={isLoggedIn} />
    </React.Fragment>
  );
}

export default App;
