import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import style from './AppHeader.module.scss';
import { Link } from 'react-router-dom';
import DarkLogoImg from '../../assets/dark-logo.png';
import LogoImg from '../../assets/logo.png';
import DarkLogoImgX2 from '../../assets/dark-logo-x2.png';
import LogoImgX2 from '../../assets/logo-x2.png';
import { gql } from 'apollo-boost';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { MY_PROFILE } from '../../layout/Main/MainQueries';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

const AppHeader = ({ leftButton, rightButton, title, customTitle, withNotification }) => {
  const client = useApolloClient();
  const { data: { darkMode } } = useQuery(DARK_MODE);

  const [newMessagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    if (withNotification) {
      const { myProfile } = client.cache.readQuery({ query: MY_PROFILE });
      if (myProfile) {
        setMessagesCount(myProfile.newMessagesCount);
      }
    }
  }, [withNotification, client]);

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
              : customTitle
                ? customTitle
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
              <React.Fragment>
                { withNotification &&
                  newMessagesCount &&
                  newMessagesCount !== 0
                  ? <div className={style.NewNotificationsCount}>
                      <span>{ newMessagesCount }</span>
                    </div>
                  : null
                }
                { rightButton }
              </React.Fragment>
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
  customTitle: PropTypes.node,
  title: PropTypes.string,
  withNotification: PropTypes.bool
}

export default AppHeader;
