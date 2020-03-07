import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import style from './Layout.module.scss';

export default ({ children }) => (
  <section className={style.Section}>
    <main className={style.Main}>
      { children }
    </main>
    <Header />
    <Footer />
  </section>
);
