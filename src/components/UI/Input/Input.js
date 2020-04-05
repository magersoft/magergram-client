import React from 'react';
import PropType from 'prop-types';
import style from './Input.module.scss';

const Input = ({
    type,
    value,
    name,
    placeholder,
    required,
    icon,
    onChange,
    onBlur,
    onFocus
  }) => {
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
          aria-label={placeholder}
          aria-required="true"
          autoCapitalize="off"
          autoCorrect="off"
          maxLength="75"
          name={name}
          required={required}
          className={style.Input}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </label>
      <div className={style.Suffix}>
        { icon && <span className={`${icon} ${style.Icon} sprite`} /> }
      </div>
    </div>
  )
};

Input.propTypes = {
  type: PropType.string,
  name: PropType.string,
  placeholder: PropType.string
};

Input.defaultProps = {
  type: 'text',
  placeholder: ''
};

export default Input;
