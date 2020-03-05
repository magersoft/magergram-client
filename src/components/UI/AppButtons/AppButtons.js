import React from 'react';
import style from './AppButtons.module.scss';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();

  return (
    <div className={style.AppButtons}>
      <p className={style.Text}>{t('Install application')}.</p>
      <div className={style.Buttons}>
        <a href="https://github.com/magersoft/magergram-app" className={style.Link}>
          <div className={`${style.AppStore} sprite`} />
        </a>
        <a href="https://github.com/magersoft/magergram-app" className={style.Link}>
          <div className={`${style.GooglePlay} sprite`} />
        </a>
      </div>
    </div>
  )
};
