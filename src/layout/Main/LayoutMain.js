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
import { LISTEN_MESSAGE, MY_PROFILE, UPDATE_USER_IPDATA } from './MainQueries';
import { gql } from 'apollo-boost';
import style from './Layout.module.scss';
import NewMessageListener from '../../components/NewMessageListener';
import fetchIpData from '../../utils/fetchIpData';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

export default ({ children }) => {
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState({
    active: false,
    message: null
  });
  const [ipData, setIpData] = useState(null);

  const [setGlobalLoading] = useMutation(SET_LOADING);
  const [removeGlobalLoading] = useMutation(REMOVE_LOADING);
  const [setDarkMode] = useMutation(TOGGLE_DARK_MODE_CLIENT);
  const [setLanguage] = useMutation(SET_LANGUAGE);

  const { data: { darkMode } } = useQuery(DARK_MODE);

  const { data, loading, subscribeToMore } = useQuery(MY_PROFILE, {
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      const { myProfile } = data;
      if (myProfile) {
        subscribeToMore({
          document: LISTEN_MESSAGE,
          variables: { userId: myProfile.id },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const { listenMessage } = subscriptionData.data;
            if (listenMessage) {
              setNewMessage(prevState => ({
                ...prevState,
                active: true,
                message: listenMessage
              }));
              return Object.assign({}, prev, {
                myProfile: { ...prev.myProfile, newMessagesCount: prev.myProfile.newMessagesCount + 1 }
              })
            }
          }
        })
      }
    }
  });

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

  useEffect(() => {
    const getIpData = async () => {
      setIpData(await fetchIpData());
    }
    getIpData();
  }, [setIpData]);

  const [updateIpData] = useMutation(UPDATE_USER_IPDATA);

  useEffect(() => {
    updateIpData({
      variables: {
        ipdata: JSON.stringify(ipData)
      }
    })
  }, [ipData]);

  return (
    <section className={style.Section}>
      <main className={style.Main} role="main">
        { children }
      </main>
      <Header user={user} darkMode={darkMode} />
      <Footer />
      <BottomNavigation user={user} />
      <NewMessageListener
        active={newMessage.active}
        message={newMessage.message}
        onClose={() => setNewMessage(prevState => ({ ...prevState, active: false }))}
      />
    </section>
  )

};
