import React, { useState } from 'react';
import style from '../EditProfile.module.scss';
import NoAvatarImg from '../../../assets/noAvatar.jpg';
import { Button, Image, Input } from '../../../components/UI';
import { useTranslation } from 'react-i18next';
import UploadAvatar from '../../../components/UploadAvatar';
import { useMutation } from '@apollo/react-hooks';
import { EDIT_USER } from '../EditProfileQueries';
import Toast from '../../../components/Toast';
import Spinner from '../../../components/Loader/Spinner';

export default ({ user, setUser }) => {
  const { t } = useTranslation();
  const [dialogChangeAvatar, setDialogChangeAvatar] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [state, setState] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    website: user.website,
    bio: user.bio,
    email: user.email,
    phone: user.phone
  });

  const [updateUser, { loading }] = useMutation(EDIT_USER, {
    variables: state,
    update: (_, result) => {
      const { data: { editUser } } = result;
      if (editUser) {
        setUser(editUser);
        setToastShow(true);
      }
    }
  });

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleClickAvatar = () => {
    setDialogChangeAvatar(true);
  };

  const handleUpdatedAvatar = avatar => {
    setUser({ ...user, avatar });
  };

  const handleUpdateUser = event => {
    event.preventDefault();
    updateUser();
  };

  return (
    <React.Fragment>
      <div className={style.ChangeAvatar}>
        <div className={style.AvatarWrapper}>
          <div className={style.Avatar}>
            <button className={style.AvatarChange} title={t('Change profile photo')} onClick={handleClickAvatar}>
              <Image src={user.avatar || NoAvatarImg} alt={t('Change profile photo')} />
            </button>
          </div>
        </div>
        <div className={style.Username}>
          <h1>{ user.username }</h1>
          <button onClick={handleClickAvatar}>
            { t('Change profile photo') }
          </button>
        </div>
      </div>
      <form className={style.Form} method="POST" onSubmit={handleUpdateUser}>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('First Name') }</aside>
          <div className={style.Input}>
            <Input
              value={state.firstName}
              placeholder={t('First Name')}
              onChange={handleChange('firstName')}
              disabled={loading}
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('Last Name') }</aside>
          <div className={style.Input}>
            <Input
              value={state.lastName}
              placeholder={t('Last Name')}
              onChange={handleChange('lastName')}
              disabled={loading}
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('Website') }</aside>
          <div className={style.Input}>
            <Input
              value={state.website}
              placeholder={t('Website')}
              onChange={handleChange('website')}
              disabled={loading}
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('Bio') }</aside>
          <div className={style.Input}>
            <Input
              type="textarea"
              value={state.bio}
              placeholder={t('Bio')}
              disabled={loading}
              onChange={handleChange('bio')}
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('Email') }</aside>
          <div className={style.Input}>
            <Input
              value={state.email ? state.email : ''}
              placeholder={t('Email')}
              onChange={handleChange('email')}
              disabled={loading}
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label}>{ t('Phone') }</aside>
          <div className={style.Input}>
            <Input
              value={state.phone ? state.phone : ''}
              placeholder={t('Phone')}
              onChange={handleChange('phone')}
              disabled={loading}
            />
          </div>
        </div>
        <div className={style.Control}>
          <aside className={style.Label} />
          <div className={`${style.Input} ${style.Buttons}`}>
            <div className={style.Submit}>
              <Button label={t('Send')} disabled={loading} type="submit" />
              { loading && <Spinner width={25} height={25} /> }
            </div>
            <Button label={t('Disable account')} disabled type="secondary" />
          </div>
        </div>
      </form>
      <UploadAvatar
        dialogShow={dialogChangeAvatar}
        avatar={user.avatar}
        dialogClose={() => setDialogChangeAvatar(false)}
        avatarUpdated={handleUpdatedAvatar}
      />
      <Toast show={toastShow} duration={4000} message={ t('Your profile has been updated') } />
    </React.Fragment>
  )
}
