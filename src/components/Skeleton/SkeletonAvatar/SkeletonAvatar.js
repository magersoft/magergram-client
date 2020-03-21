import React from 'react';
import PropTypes from 'prop-types';
import style from './SkeletonAvatar.module.scss';

const SkeletonAvatar = ({ width, height, className }) => (
  <div
    style={{ width, height }}
    className={`${style.SkeletonAvatar} ${className}`}
  />
);

SkeletonAvatar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string
};

export default SkeletonAvatar;
