import React from 'react';
import PropTypes from 'prop-types';
import NoAvatarImg from '../../../assets/noAvatar.jpg';
import style from './Image.module.scss';

const STATIC_SERVER = process.env.REACT_APP_STATIC_SERVER || 'http://localhost:4000';

const Image = ({ src, alt, className = '' }) => {
  const source = src !== NoAvatarImg ? STATIC_SERVER + src : NoAvatarImg;
  return (
    <img src={source} alt={alt} className={`${style.Image} ${className}`} />
  )
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string
};

export default Image;
