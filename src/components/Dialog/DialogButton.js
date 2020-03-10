import React from 'react';
import PropTypes from 'prop-types';
import style from './Dialog.module.scss';

const DialogButton = ({ text, danger, onClick }) => {

  const classes = [style.DialogButton];
  if (danger) {
    classes.push(style.danger);
  }

  return (
    <button
      className={classes.join(' ')}
      onClick={onClick}
    >{ text }</button>
  )
};

DialogButton.propTypes = {
  text: PropTypes.string.isRequired,
  danger: PropTypes.bool,
  onClick: PropTypes.func
};

export default DialogButton;
