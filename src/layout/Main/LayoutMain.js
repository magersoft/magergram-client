import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './Layout.module.scss';
import BottomNavigation from '../../components/BottomNavigation';

export default ({ children }) => {
  const [user, setUser] = useState(null);
  const [showActivity, setShowActivity] = useState(false);

  return (
    <section className={style.Section}>
      <main className={style.Main} role="main">
        { children }
      </main>
      <Header setUser={setUser} activity={showActivity} />
      <Footer />
      <BottomNavigation user={user} onActivity={state => setShowActivity(state)} />
    </section>
  )

};
