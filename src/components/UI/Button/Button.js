import React from 'react';
import style from './Button.module.scss';

const Button = ({ label, disabled }) => {
  return (
    <button
      type="submit"
      className={style.Button}
      disabled={disabled}
    >
      <div className={style.Text}>{ label }</div>
    </button>
  )
};

export default Button;
