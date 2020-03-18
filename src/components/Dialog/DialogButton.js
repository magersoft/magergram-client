import React from 'react';
import PropTypes from 'prop-types';
import style from './Dialog.module.scss';

const DialogButton = ({ type, text, onClick }) => {

  const classes = [style.DialogButton];

  if (type) {
    classes.push(style[type]);
  }

  return (
    <button
      className={classes.join(' ')}
      onClick={onClick}
    >{ text }</button>
  )
};

DialogButton.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default DialogButton;
