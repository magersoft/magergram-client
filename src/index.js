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

serviceWorker.register({
  onUpdate: registration =>
    Client.writeData({
      data: {
        serviceWorkerUpdated: true,
        serviceWorkerRegistration: registration
      }
    })
});
