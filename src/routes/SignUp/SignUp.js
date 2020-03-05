import React, { useState } from 'react';
import style from './SignUp.module.scss';
import { useTranslation } from 'react-i18next';
import { AppButtons, Button, Input, Separator } from '../../components/UI';
import { Link } from 'react-router-dom';

export default () => {
  const [state, setState] = useState({
    phoneOrEmail: '',
    fullName: '',
    username: '',
    password: ''
  });
  const { t } = useTranslation();

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value })
  };

  return (
    <div className={style.Content}>
      <div className={style.Box}>
        <h1 className={`${style.Title} sprite`}>Magergram</h1>
        <form className={style.Form} method="post">
          <h2 className={style.Subtitle}>
            { t('Sign Up, to watch photos and videos of your friends.') }
          </h2>
          <div className={style.SocialLogin}>
            <Button label={t('Login with Facebook')} />
          </div>
          <Separator text={t('or')} />
          <div className={style.Control}>
            <Input
              value={state.phoneOrEmail}
              placeholder={t('Phone or email')}
              onChange={handleChange('phoneOrEmail')}
            />
          </div>
          <div className={style.Control}>
            <Input
              value={state.fullName}
              placeholder={t('First name and Last name')}
              onChange={handleChange('fullName')}
            />
          </div>
          <div className={style.Control}>
            <Input
              value={state.username}
              placeholder={t('Username')}
              onChange={handleChange('username')}
            />
          </div>
          <div className={style.Control}>
            <Input
              value={state.password}
              type="password"
              placeholder={t('Password')}
              onChange={handleChange('password')}
            />
          </div>
          <div className={style.Submit}>
            <Button label={t('Sign Up')} />
          </div>
        </form>
      </div>
      <div className={style.Box}>
        <div className={style.SignUp}>
          <p className={style.SignUpText}>
            { t('Have an account') }?
            <Link to="/" >
              <span className={style.SignUpLink}>{t('Sign In')}</span>
            </Link>
          </p>
        </div>
      </div>
      <AppButtons />
    </div>
  )
};
