import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Router from './Routes';
import { Loader } from './Loader';
import ThemeSwitcher from 'react-css-vars';
import light from '../theme/light';
import dark from '../theme/dark';
import Dialog from './Dialog/Dialog';
import DialogButton from './Dialog/DialogButton';
import { useTranslation } from 'react-i18next';
import { APP_VERSION } from '../apollo/GlobalQueries';

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
  const { t } = useTranslation();
  const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN);
  const { data: { loading } } = useQuery(LOADING);
  const { data: { darkMode } } = useQuery(DARK_MODE);

  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [version, setVersion] = useState(null);

  const { data } = useQuery(APP_VERSION);

  useEffect(() => {
    if (data) {
      const currentAppVersion = localStorage.getItem('version');
      const { getVersion } = data;

      if (currentAppVersion) {
        setUpdateAvailable(currentAppVersion !== getVersion);
        setVersion(getVersion);
      } else {
        localStorage.setItem('version', getVersion);
      }
    }
  }, [data]);

  const installUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.update();
          localStorage.setItem('version', version);
          window.location.reload();
        }
      })
    }
  }

  return (
    <React.Fragment>
      <ThemeSwitcher theme={darkMode ? dark : light} />
      { loading && <Loader /> }
      <Router isLoggedIn={isLoggedIn} />
      <Dialog
        show={updateAvailable}
        image
        title={t('Update available')}
        description={`${t('Application is s new version available')} v${version}`}
      >
        <DialogButton text={t('Install update')} type="danger" onClick={installUpdate} />
      </Dialog>
    </React.Fragment>
  );
}

export default App;
