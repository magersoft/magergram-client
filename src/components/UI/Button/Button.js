import React from 'react';
import PropTypes from 'prop-types';
import style from './Button.module.scss';

const Button = ({ type, label, disabled, small, className, onClick }) => {

  const classes = [style.Button, className];
  if (type === 'secondary') {
    classes.push(style.Secondary)
  } else {
    classes.push(style.Primary)
  }

  if (small) {
    classes.push(style.small);
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

Button.defaultProps = {
  className: '',
  type: 'primary'
};

export default Button;
