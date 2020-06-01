import React from 'react';
import PropTypes from 'prop-types';
import style from './AuthFooter.module.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuthFooter = ({ text, linkText, linkPath }) => {
  const { t } = useTranslation()

  return (
    <div className={style.AuthFooter}>
      <p className={style.AuthFooterText}>
        { t(text) }
        { linkPath && linkText &&
        <Link to={linkPath} >
          <span className={style.AuthFooterLink}>{t(linkText)}</span>
        </Link>
        }
      </p>
    </div>
  )
};

AuthFooter.propTypes = {
  text: PropTypes.string.isRequired,
  linkText: PropTypes.string,
  linkPath: PropTypes.string
}

AuthFooter.defaultProps = {
  linkText: '',
  linkPath: ''
}

export default AuthFooter;
