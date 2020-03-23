import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './Layout.module.scss';
import BottomNavigation from '../../components/BottomNavigation';

export default ({ children }) => (
  <section className={style.Section}>
    <main className={style.Main} role="main">
      { children }
    </main>
    <Header />
    <Footer />
    <BottomNavigation />
  </section>
);
