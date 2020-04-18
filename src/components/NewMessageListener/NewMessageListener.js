import React from 'react';
import style from './NewMessageListener.module.scss';

export default () => {

  return (
    <div className={style.Toast}>
      <div className={style.Avatar}>
        avatar
      </div>
      <div className={style.Message}>
        <div className={style.Username}>magersoft</div>
        <div className={style.Text}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, aut.</div>
      </div>
    </div>
  )
}
