import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Loader/Spinner';
import style from './Dialog.module.scss';

const DialogButton = ({ type, text, loading, disabled, onClick }) => {

  const classes = [style.DialogButton];

  if (type) {
    classes.push(style[type]);
  }

  return (
    <button
      className={classes.join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      { loading ? <Spinner width={34} height={34} /> : text }
    </button>
  )
};

DialogButton.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default DialogButton;
