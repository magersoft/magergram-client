import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import style from './Dialog.module.scss';

const Dialog = ({ title, children, show }) => {

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : null;
  }, [show]);

  return (
    show ?
      <div className={style.Overlay} role="presentation">
        <div className={style.Dialog} role="dialog" aria-haspopup="true">
          <div className={style.Container}>
            { title &&
            <div className={style.Title}>
              <h3>{ title }</h3>
            </div>
            }
            { children }
          </div>
        </div>
      </div> : null
  )
};


Dialog.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool.isRequired
};

export default Dialog;
