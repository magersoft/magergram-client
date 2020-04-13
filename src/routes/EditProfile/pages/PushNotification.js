import React, { useState } from 'react';
import style from '../EditProfile.module.scss';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../../../components/UI';
import { useMutation } from '@apollo/react-hooks';
import { EMAIL_NOTIFICATION } from '../EditProfileQueries';

export default ({ user }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    emailNotification: user.emailNotification
  });

  const [toggleEmailNotification, { loading: loadingEmailNotification }] = useMutation(EMAIL_NOTIFICATION);

  const handleToggleEmailNotification = event => {
    const { target: { checked } } = event;
    setState({ ...state, emailNotification: checked });
    toggleEmailNotification({
      variables: {
        state: checked
      }
    })
  }

  return (
    <main className={style.Main}>
      <section className={style.Section}>
        <h2 className={style.Title}>{ t('Notifications') }</h2>
        <div className={ loadingEmailNotification ? style.SectionLoading : ''}>
          <Checkbox
            label={t('Email notification')}
            checked={state.emailNotification}
            disabled={loadingEmailNotification}
            onChange={handleToggleEmailNotification}
          />
          <p className={style.HelperText}>
            { t('Send application notifications in my email. You should be added email address in your profile') }
          </p>
        </div>
      </section>
    </main>
  )
}
