import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './Layout.module.scss';
import BottomNavigation from '../../components/BottomNavigation';
import { useMutation } from '@apollo/react-hooks';
import { SEND_SUBSCRIPTION } from '../../apollo/GlobalQueries';
import { subscribeUser } from '../../subscription';
import NewMessageListener from '../../components/NewMessageListener';

export default ({ children }) => {
  const [user, setUser] = useState(null);

  const [sendSubscription] = useMutation(SEND_SUBSCRIPTION);

  useEffect(() => {
    subscribeUser(sendSubscription);
  }, [sendSubscription]);

  return (
    <section className={style.Section}>
      <main className={style.Main} role="main">
        { children }
      </main>
      <Header setUser={setUser} />
      <Footer />
      <BottomNavigation user={user} />
      {/*<NewMessageListener />*/}
    </section>
  )

};
