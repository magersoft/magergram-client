import React from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid'
import style from './Checkbox.module.scss';

const Checkbox = ({ label, checked, disabled, className, onChange }) => {

  const id = uniqid();

  return (
    <div className={`${style.Control} ${className}`}>
      <label htmlFor={id} className={style.Label}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          className={style.Input}
          onChange={onChange}
        />
        <div className={style.Checkbox} />
        { label }
      </label>
    </div>
  )
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func
};

Checkbox.defaultProps = {
  className: '',
  checked: false,
  disabled: false
};

export default Checkbox;
