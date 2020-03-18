import React from 'react';
import PropTypes from 'prop-types';
import style from './Button.module.scss';

const Button = ({ type = 'primary', label, disabled, className, onClick }) => {

  const classes = [style.Button, className];
  if (type === 'secondary') {
    classes.push(style.Secondary)
  } else {
    classes.push(style.Primary)
  }

  return (
    <button
      type="submit"
      className={classes.join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      <div className={style.Text}>{ label }</div>
    </button>
  )
};

Button.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
