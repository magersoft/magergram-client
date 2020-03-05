import React from 'react';
import Footer from '../../components/Footer';
import style from './Default.module.scss';

export default ({ children }) => (
  <section className={style.Section}>
    <main className={style.Main}>
      <div className={style.Wrapper}>
        <article className={style.Article}>
          { children }
        </article>
      </div>
    </main>
    <Footer />
  </section>
);
