import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import style from './Toast.module.scss';

const Toast = ({ message, show, duration }) => {
  const [active, setActive] = useState(show);

  useEffect(() => {
    setActive(show);
    const timeout = setTimeout(() => {
      setActive(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [show]);

  return (
    <div className={`${style.Toast} ${active ? style.show : ''}`}>
      <div className={style.Message}>{ message }</div>
      <div className={style.Close}>
        close
      </div>
    </div>
  )
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  show: PropTypes.bool,
  duration: PropTypes.number
};

Toast.defaultProps = {
  message: '',
  show: false,
  duration: 5000
};

export default Toast;
