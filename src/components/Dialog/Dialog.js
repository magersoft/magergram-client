import React from 'react';
import style from './Dialog.module.scss';

export default ({ title, children }) => {

  return (
    <div className={style.Overlay} role="presentation">
      <div className={style.Dialog} role="dialog">
        <div className={style.Container}>
          { title &&
            <div className={style.Title}>
              <h3>{ title }</h3>
            </div>
          }
          { children }
        </div>
      </div>
    </div>
  )
};
