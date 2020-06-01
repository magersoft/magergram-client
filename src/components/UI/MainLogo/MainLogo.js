import React from 'react';
import PropTypes from 'prop-types';
import style from './Logo.module.scss';
import DarkLogoImg from '../../../assets/dark-logoLogin.png';
import Logo from '../../../assets/logoLogin.png';
import DarkLogoImgX2 from '../../../assets/dark-logoLogin-x2.png';
import LogoX2 from '../../../assets/logoLogin-x2.png';

const MainLogo = ({ darkMode }) => {

  return (
    <div className={style.Logo}>
      <img src={darkMode ? DarkLogoImg : Logo} srcSet={darkMode ? DarkLogoImgX2 : LogoX2} alt="Magergram" />
    </div>
  )
}

MainLogo.propTypes = {
  darkMode: PropTypes.bool
};

MainLogo.defaultProps = {
  darkMode: false
}

export default MainLogo;
