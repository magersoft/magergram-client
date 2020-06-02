import React from 'react';
import style from './Footer.module.scss';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { SET_LANGUAGE } from '../../apollo/GlobalQueries';

export default () => {
  const { t, i18n } = useTranslation();

  const [setClientLanguage] = useMutation(SET_LANGUAGE);

  const handleLanguageSelectChange = event => {
    const lang = event.target.value;

    i18n.changeLanguage(lang);
    setClientLanguage({
      variables: {
        lang
      }
    })
  }

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
              <a href="/">{t('Mobile Application')}</a>
            </li>
            <li>
              <a href="#">{ t('Language') }</a>
              <select className={style.LanguageSelect} name="language" id="languageSelect" onChange={handleLanguageSelectChange}>
                <option value="ru">
                  Русский
                </option>
                <option value="en">
                  English
                </option>
              </select>
            </li>
          </ul>
        </nav>
        <span className={style.Info}>{t('This is not a real application. This is a clone for fun')}</span>
        <span className={style.Info}>© Magergram {t('from')} Magersoft, { new Date().getFullYear() }</span>
      </div>
    </footer>
  )
};
