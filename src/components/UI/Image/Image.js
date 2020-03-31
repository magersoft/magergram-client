import React from 'react';
import PropTypes from 'prop-types';
import NoAvatarImg from '../../../assets/noAvatar.jpg';
import style from './Image.module.scss';

const Image = ({ id, src, alt, className = '' }) => {
  const source = src !== NoAvatarImg ? src : NoAvatarImg;
  return (
    <img id={id} src={source} alt={alt} className={`${style.Image} ${className}`} />
  )
};

Image.propTypes = {
  id: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string
};

export default Image;
