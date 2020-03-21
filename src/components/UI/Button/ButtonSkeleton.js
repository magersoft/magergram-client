import React from 'react';
import PropTypes from 'prop-types';
import style from './Button.module.scss';

const ButtonSkeleton = ({ width, className }) => (
  <button
    style={{ width }}
    className={`${style.Button} ${style.Skeleton} ${className}`}
    disabled
  />
);

ButtonSkeleton.propTypes = {
  width: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default ButtonSkeleton;

