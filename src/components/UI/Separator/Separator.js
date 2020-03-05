import React from 'react';
import style from './Separator.module.scss';

const Separator = ({ text }) => (
  <div className={style.OrBlock}>
    <div className={style.Separator} />
    <div className={style.Or}>{ text }</div>
    <div className={style.Separator} />
  </div>
);

export default Separator;

