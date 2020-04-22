import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BottomNavigation from '../../components/BottomNavigation';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  REMOVE_LOADING,
  SEND_SUBSCRIPTION,
  SET_LANGUAGE,
  SET_LOADING,
  TOGGLE_DARK_MODE_CLIENT
} from '../../apollo/GlobalQueries';
import { subscribeUser } from '../../subscription';
import { MY_PROFILE } from './MainQueries';
import { gql } from 'apollo-boost';
import style from './Layout.module.scss';
// import NewMessageListener from '../../components/NewMessageListener';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

export default ({ children }) => {
  const [user, setUser] = useState(null);

  const [setGlobalLoading] = useMutation(SET_LOADING);
  const [removeGlobalLoading] = useMutation(REMOVE_LOADING);
  const [setDarkMode] = useMutation(TOGGLE_DARK_MODE_CLIENT);
  const [setLanguage] = useMutation(SET_LANGUAGE);

  const { data: { darkMode } } = useQuery(DARK_MODE);

  const { data, loading } = useQuery(MY_PROFILE);

  useEffect(() => {
    if (data) {
      const { myProfile } = data;
      if (myProfile) {
        const { darkMode, language } = myProfile;
        setUser(myProfile);
        setDarkMode({ variables: { darkMode } });
        setLanguage({ variables: { lang: language } });
      }
    }
  }, [data, setDarkMode, setLanguage]);

  useEffect(() => {
    if (loading) {
      setGlobalLoading();
    }
    if (!loading && data) {
      removeGlobalLoading();
    }
  }, [loading, data, setGlobalLoading, removeGlobalLoading]);

  const [sendSubscription] = useMutation(SEND_SUBSCRIPTION);

  useEffect(() => {
    subscribeUser(sendSubscription);
  }, [sendSubscription]);

  return (
    <section className={style.Section}>
      <main className={style.Main} role="main">
        { children }
      </main>
      <Header user={user} darkMode={darkMode} />
      <Footer />
      <BottomNavigation user={user} />
      {/*<NewMessageListener />*/}
    </section>
  )

};
