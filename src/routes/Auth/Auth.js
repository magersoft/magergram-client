import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, AppButtons, Separator } from '../../components/UI';
import { useMutation } from '@apollo/react-hooks';
import { SIGN_IN } from './AuthQueries';
import { toast } from 'react-toastify';
import style from './Auth.module.scss';
import { LOG_USER_IN } from '../../apollo/GlobalQueries';

export default () => {
  const [state, setState] = useState({
    username: '',
    password: ''
  });
  const [signIn, { data }] = useMutation(SIGN_IN);
  const [logUserIn] = useMutation(LOG_USER_IN);
  const { t } = useTranslation();

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value })
  };

  const onSubmit = event => {
    event.preventDefault();
    signIn({
      variables: {
        email: state.username,
        password: state.password
      },
      update: (_, result) => {
        const { data: { signIn } } = result;
        const token = signIn.token;
        if (signIn.error) {
          toast.error(signIn.error);
          return false;
        }
        if (signIn.token) {
          logUserIn({
            variables: {
              token
            }
          })
        }
      }
    })
  };

  return (
    <div className={style.Content}>
      <div className={style.Box}>
        <h1 className={`${style.Title} sprite`}>Magergram</h1>
        <div className={style.Controls}>
          <form className={style.Form} method="post" onSubmit={onSubmit}>
            <div className={style.SpacingL} />
            <div className={style.Control}>
              <Input
                placeholder={t('Phone number, username or email')}
                name="username"
                value={state.username}
                onChange={handleChange('username')}
              />
            </div>
            <div className={style.Control}>
              <Input
                type="password"
                placeholder={t('Password')}
                name="password"
                value={state.password}
                onChange={handleChange('password')}
              />
            </div>
            <div className={style.Submit}>
              <Button label={t('Login')} disabled={!state.username || !state.password} />
            </div>
            <Separator text={t('or')} />
            <div className={style.SocialLogin}>
              <button className={style.FacebookButton}>
                <span className={`${style.FacebookIcon} sprite`} />
                <span className={style.FacebookText}>{t('Login with Facebook')}</span>
              </button>
            </div>
            <Link to="/" className={style.ForgotPassword}>{t('Forgot password')}?</Link>
          </form>
        </div>
      </div>
      <div className={style.Box}>
        <div className={style.SignUp}>
          <p className={style.SignUpText}>
            { t('Don\'t have an account') }?
            <Link to="/signup" >
              <span className={style.SignUpLink}>{t('Sign Up')}</span>
            </Link>
          </p>
        </div>
      </div>
      <AppButtons />
    </div>
  )
};
