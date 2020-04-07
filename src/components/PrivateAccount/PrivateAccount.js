import React from 'react';
import style from './PrivateAccount.module.scss';

export default () => {
  return (
    <div className={style.PrivateAccount}>
      <div className={style.Header}>
        <h5>Это закрытый аккаунт</h5>
      </div>
      <div className={style.Text}>
        <span>Подпишитесь, чтобы видеть его/ее фото и видео.</span>
      </div>
    </div>
  )
};
