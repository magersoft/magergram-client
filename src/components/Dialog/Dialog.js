import React from 'react';
import style from './Dialog.module.scss';

export default ({ children }) => {

  return (
    <div className={style.Overlay} role="presentation">
      <div className={style.Dialog} role="dialog">
        <div className={style.Container}>
          { children }
        </div>
      </div>
    </div>
  )
};
