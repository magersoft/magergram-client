import React from 'react';
import PropTypes from 'prop-types';
import style from './AppHeader.module.scss';
import { Link } from 'react-router-dom';
import DarkLogoImg from '../../assets/dark-logo.png';
import LogoImg from '../../assets/logo.png';
import DarkLogoImgX2 from '../../assets/dark-logo-x2.png';
import LogoImgX2 from '../../assets/logo-x2.png';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

const AppHeader = ({ leftButton, rightButton, title }) => {
  const { data: { darkMode } } = useQuery(DARK_MODE);

  return (
    <nav className={style.Header}>
      <div className={style.Wrapper} />
      <div className={style.Inner}>
        <div className={style.Container}>
          <div className={style.Grid}>
            <div className={style.LeftButton}>
              { leftButton }
            </div>
            { title
              ? <h1 className={style.Title}>{ title }</h1>
              : <div className={style.Logo}>
                <Link to="/">
                  <div className={style.LogoContainer}>
                    <div className={style.LogoImg}>
                      <img src={darkMode ? DarkLogoImg : LogoImg} srcSet={darkMode ? DarkLogoImgX2 : LogoImgX2} alt="Magergram" />
                    </div>
                  </div>
                </Link>
              </div>
            }
            <div className={style.RightButton}>
              { rightButton }
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

AppHeader.propTypes = {
  leftButton: PropTypes.node,
  rightButton: PropTypes.node,
  title: PropTypes.string
}

export default AppHeader;
