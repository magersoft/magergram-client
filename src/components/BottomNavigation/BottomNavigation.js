import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../UI';
import style from './BottomNavigation.module.scss';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();

  return (
    <nav className={`${style.Navigation} bottom-navigation`}>
      <div className={style.Container}>
        <Link to="/add-post" title={t('Add Post')}>
          <span className={`${style.AddPostIcon} sprite-glyphs`} />
        </Link>
      </div>
    </nav>
  )
};
