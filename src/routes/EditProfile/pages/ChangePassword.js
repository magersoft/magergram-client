import React, { useState } from 'react';
import style from '../EditProfile.module.scss';
import { Button, Image, Input } from '../../../components/UI';
import NoAvatarImg from '../../../assets/noAvatar.jpg';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import Spinner from '../../../components/Loader/Spinner';
import { CHANGE_PASSWORD } from '../EditProfileQueries';
import Toast from '../../../components/Toast';

export default ({ user }) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: null
  });
  const [toastShow, setToastShow] = useState(false);

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleChangePassword = event => {
    event.preventDefault();
    if (state.confirmPassword !== state.newPassword) {
      setState({ ...state, error: t('New password different') });
      return false;
    }
    changePassword({
      variables: {
        currentPassword: state.currentPassword,
        newPassword: state.newPassword
      },
      update: (_, result) => {
        const { data: { changePassword } } = result;
        if (changePassword.ok) {
          setState({ ...state, error: null });
          setToastShow(!toastShow);
        } else {
          setState({ ...state, error: t(changePassword.error) });
        }
      }
    })
  };

  return (
    <React.Fragment>
      <div className={style.ChangeAvatar}>
        <div className={style.AvatarWrapper}>
          <div className={style.Avatar}>
            <button className={style.AvatarChange} title={t('Change profile photo')}>
              <Image src={user.avatar || NoAvatarImg} alt={t('Change profile photo')} />
            </button>
          </div>
        </div>
        <div className={`${style.Username} ${style.WithoutUpload}`}>
          <h1>{ user.username }</h1>
        </div>
      </div>
      <form className={`${style.Form} ${style.FormPassword}`} method="POST" onSubmit={handleChangePassword}>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('Current password') }</aside>
          <div className={style.Input}>
            <Input
              type="password"
              value={state.currentPassword}
              placeholder={t('Current password')}
              onChange={handleChange('currentPassword')}
              disabled={loading}
              required
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('New password') }</aside>
          <div className={style.Input}>
            <Input
              type="password"
              value={state.newPassword}
              placeholder={t('New password')}
              onChange={handleChange('newPassword')}
              disabled={loading}
              required
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('Confirm password') }</aside>
          <div className={style.Input}>
            <Input
              type="password"
              value={state.confirmPassword}
              placeholder={t('Confirm password')}
              onChange={handleChange('confirmPassword')}
              disabled={loading}
              required
            />
          </div>
        </div>
        { state.error &&
        <div className={style.Error}>
          <span>{ state.error }</span>
        </div>
        }
        <div className={style.Control}>
          <aside className={style.Label} />
          <div className={`${style.Input} ${style.Buttons}`}>
            <div className={style.Submit}>
              <Button type="submit" disabled={loading} label={t('Change password')} />
              { loading && <Spinner width={25} height={25} /> }
            </div>
          </div>
        </div>
      </form>
      <Toast show={toastShow} duration={4000} message={t('Password was be changed')} />
    </React.Fragment>
  )
}
