import React, { useState } from 'react';
import style from '../EditProfile.module.scss';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '../../../components/UI';
import { useMutation } from '@apollo/react-hooks';
import { PRIVATE_ACCOUNT } from '../EditProfileQueries';
import { MY_PROFILE } from '../../../layout/Main/MainQueries';

export default ({ user }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    isPrivate: user.isPrivate
  });

  const [togglePrivateAccount, { loading: loadingPrivateAccount }] = useMutation(PRIVATE_ACCOUNT);

  const handleTogglePrivateAccount = event => {
    const { target: { checked } } = event;
    setState({ ...state, isPrivate: checked });
    togglePrivateAccount({
      variables: {
        state: checked
      },
      refetchQueries: [{ query: MY_PROFILE }]
    })
  };

  return (
    <main className={style.Main}>
      <section className={style.Section}>
        <h2 className={style.Title}>{ t('Confidential and security') }</h2>
        <div className={ loadingPrivateAccount ? style.SectionLoading : '' }>
          <Checkbox
            label={t('Private account')}
            checked={state.isPrivate}
            disabled={loadingPrivateAccount}
            onChange={handleTogglePrivateAccount}
          />
          <p className={style.HelperText}>{ t('If you have private account, your posts in Magergram will be able to see only people which you allowed. This does not apply current followers') }.</p>
        </div>
      </section>
    </main>
  )
}
