import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import App from './components/App';
import Client from './apollo/Client';
import './i18n';
import './index.scss';
import * as serviceWorker from './serviceWorker';

const Application = () => (
  <ApolloProvider client={Client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
