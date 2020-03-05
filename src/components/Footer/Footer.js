import React from 'react';
import style from './Footer.module.scss';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  return (
    <footer className={style.Footer} role="contentinfo">
      <div className={style.Container}>
        <nav className={style.Nav}>
          <ul>
            <li>
              <a href="https://github.com/magersoft">GitHub</a>
            </li>
            <li>
              <a href="https://github.com/magersoft/magergram-api">API</a>
            </li>
            <li>
              <a href="https://github.com/magersoft/magergram-client">{t('Client')}</a>
            </li>
            <li>
              <a href="https://github.com/magersoft/magergrap-app">{t('Mobile Application')}</a>
            </li>
          </ul>
        </nav>
        <span className={style.Info}>{t('This is not a real application. This is a clone for fun')}</span>
        <span className={style.Info}>© Magergram от Magersoft, { new Date().getFullYear() }</span>
      </div>
    </footer>
  )
};
