import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '../Icon';
import style from './Dialog.module.scss';

import AppIcon from '../../assets/logo512.png';

const Dialog = ({ title, image, description, children, show, withScrollingData, fullScreen, onClose }) => {

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : null;
  }, [show]);

  return (
    show ?
      <div className={`${style.Overlay} ${fullScreen ? style.fullScreen : null}`} role="presentation">
        <div className={style.Dialog} role="dialog" aria-haspopup="true">
          <div className={style.Container}>
            { image &&
            <div className={style.DialogImage}>
              <div className={style.AppIcon}>
                <img src={AppIcon} alt="Application icon" />
              </div>
            </div>
            }
            { title &&
            <div className={`${style.Title} ${withScrollingData && style.withScrollingData}`}>
              <h3>{ title }</h3>
              { withScrollingData &&
                <div className={style.CloseIcon} onClick={onClose}>
                  <CloseIcon width={24} height={24} color="var(--color-main)" />
                </div>
              }
            </div>
            }
            { description &&
            <div className={style.Description}>
              <span>{ description }</span>
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
  image: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  description: PropTypes.string,
  withScrollingData: PropTypes.bool,
  fullscreen: PropTypes.bool,
  onClose: PropTypes.func
};

export default Dialog;
