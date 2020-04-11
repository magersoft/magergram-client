import React from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Router from './Routes';
import { Loader } from './Loader';
import ThemeSwitcher from 'react-css-vars';
import light from '../theme/light';
import dark from '../theme/dark';
import Dialog from './Dialog/Dialog';
import { useTranslation } from 'react-i18next';
import DialogButton from './Dialog/DialogButton';

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

const SERVICE_WORKER_UPDATED = gql`
  {
    serviceWorkerUpdated @client
    serviceWorkerRegistration @client
  }
`

function App() {
  const client = useApolloClient();
  const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN);
  const { data: { loading } } = useQuery(LOADING);
  const { data: { darkMode } } = useQuery(DARK_MODE);
  const { data: { serviceWorkerUpdated, serviceWorkerRegistration } } = useQuery(SERVICE_WORKER_UPDATED);

  const { t } = useTranslation();

  const installUpdate = () => {
    if (serviceWorkerRegistration) {
      const registrationWaiting = serviceWorkerRegistration.waiting;
      if (registrationWaiting) {
        registrationWaiting.postMessage({ type: 'SKIP_WAITING' });

        registrationWaiting.addEventListener('statechange', e => {
          if (e.target.state === 'activated') {
            client.writeData({ data: { serviceWorkerUpdated: false } });
            window.location.reload();
          }
        })
      }
    }
  }

  return (
    <React.Fragment>
      <ThemeSwitcher theme={darkMode ? dark : light} />
      { loading && <Loader /> }
      <Router isLoggedIn={isLoggedIn} />
      <Dialog
        show={serviceWorkerUpdated}
        image
        title={t('Update available')}
        description={t('Application is s new version available')}
      >
        <DialogButton text={t('Install update')} type="danger" onClick={installUpdate} />
      </Dialog>
    </React.Fragment>
  );
}

export default App;
