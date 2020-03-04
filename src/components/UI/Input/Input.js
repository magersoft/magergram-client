import React, { useState } from 'react';
import PropType from 'prop-types';
import style from './Input.module.scss';

const Input = ({ type = 'text', name, placeholder }) => {
  const [value, setValue] = useState('');

  const labelClasses = [style.Label, value ? style.active : ''];

  return (
    <div className={style.Control}>
      <label className={labelClasses.join(' ')}>
        <span className={style.Placeholder}>
          { placeholder }
        </span>
        <input
          type={type}
          value={value}
          aria-label
          aria-required="true"
          autoCapitalize="off"
          autoCorrect="off"
          maxLength="75"
          name={name}
          className={style.Input}
          onChange={event => setValue(event.target.value)}
        />
      </label>
    </div>
  )
};

Input.propTypes = {
  type: PropType.string,
  name: PropType.string,
  placeholder: PropType.string
};

export default Input;
