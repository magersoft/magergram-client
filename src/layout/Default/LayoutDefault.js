import React from 'react';
import Footer from '../../components/Footer';
import style from './Default.module.scss';

export default ({ children }) => (
  <section className={style.Section}>
    { children }
    <Footer />
  </section>
);
