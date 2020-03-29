import React from 'react';
import PropTypes from 'prop-types';
import style from './SkeletonBlock.module.scss';

const SkeletonBlock = ({ maxWidth, maxHeight, className }) => (
  <div
    style={{ maxWidth, maxHeight }}
    className={`${style.SkeletonBlock} ${className}`}
  />
);

SkeletonBlock.propTypes = {
  maxWidth: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  className: PropTypes.string
};

SkeletonBlock.defaultProps = {
  className: ''
};

export default SkeletonBlock;
