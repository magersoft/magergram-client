import React from 'react';
import AppHeader from '../../components/AppHeader';
import style from './Direct.module.scss';
import { useTranslation } from 'react-i18next';
import BackIcon from '../../components/Icon/BackIcon';

export default ({ history }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <AppHeader
        title={t('Direct')}
        leftButton={
          <button className={style.Back} onClick={history.goBack}>
            <BackIcon width={24} height={24} color="var(--color-main)" />
          </button>
        }
      />
      <div className="container">
        Coming soon ...
      </div>
    </React.Fragment>
  )
}
