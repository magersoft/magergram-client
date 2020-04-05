import React from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import style from './RadioButton.module.scss';

const RadioButton = ({ buttons, name, onChange }) => {

  return (
    <fieldset>
      { buttons.map(radio => {
        const { label, value, checked, disabled } = radio;
        const id = uniqid();
        return (
          <label htmlFor={id} className={style.Label} key={value}>
            <div className={style.Control}>
              <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className={style.Input}
              />
              { label }
            </div>
          </label>
        )
      }) }
    </fieldset>
  )
};

RadioButton.propTypes = {
  buttons: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

RadioButton.defaultProps = {};

export default RadioButton;
