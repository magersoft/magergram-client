import React from 'react';
import PropTypes from 'prop-types';
import style from './SkeletonString.module.scss';

const SkeletonString = ({ width, height, className }) => (
  <span
    style={{ width, height }}
    className={`${style.SkeletonString} ${className}`}
  />
);

SkeletonString.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default SkeletonString;
