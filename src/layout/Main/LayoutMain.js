import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './Layout.module.scss';
import BottomNavigation from '../../components/BottomNavigation';

export default ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <section className={style.Section}>
      <main className={style.Main} role="main">
        { children }
      </main>
      <Header setUser={setUser} />
      <Footer />
      <BottomNavigation user={user} />
    </section>
  )

};
