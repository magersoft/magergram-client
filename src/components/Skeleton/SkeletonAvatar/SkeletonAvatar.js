import React from 'react';
import PropTypes from 'prop-types';
import style from './SkeletonAvatar.module.scss';

const SkeletonAvatar = ({ width, height, maxWidth, maxHeight, className }) => (
  <div
    style={{ width, height, maxWidth, maxHeight, paddingBottom: maxWidth && maxHeight ? '100%' : null }}
    className={`${style.SkeletonAvatar} ${className}`}
  />
);

SkeletonAvatar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  className: PropTypes.string
};

SkeletonAvatar.defaultProps = {
  className: ''
};

export default SkeletonAvatar;
