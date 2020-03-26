import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import style from './Dialog.module.scss';
import { CloseIcon } from '../Icon';

const Dialog = ({ title, children, show, withScrollingData, fullScreen, onClose }) => {

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : null;
  }, [show]);

  return (
    show ?
      <div className={`${style.Overlay} ${fullScreen ? style.fullScreen : null}`} role="presentation">
        <div className={style.Dialog} role="dialog" aria-haspopup="true">
          <div className={style.Container}>
            { title &&
            <div className={`${style.Title} ${withScrollingData && style.withScrollingData}`}>
              <h3>{ title }</h3>
              { withScrollingData &&
                <div className={style.CloseIcon} onClick={onClose}>
                  <CloseIcon width={24} height={24} />
                </div>
              }
            </div>
            }
            <div className={withScrollingData && style.FixedSize}>{ children }</div>
          </div>
        </div>
      </div> : null
  )
};


Dialog.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool.isRequired,
  withScrollingData: PropTypes.bool,
  fullscreen: PropTypes.bool,
  onClose: PropTypes.func
};

export default Dialog;
