import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useTranslation } from 'react-i18next';
import { Button, Input, MainLogo, Separator } from '../../components/UI';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { SIGN_IN } from './SignInQueries';
import { LOG_USER_IN } from '../../apollo/GlobalQueries';
import { isValidPhone } from '../../utils/phoneRegExp';
import style from './SignIn.module.scss';
import AuthFooter from '../../components/AuthFooter';

const DARK_MODE = gql`
  {
    darkMode @client
  }
`;

export default () => {
  const [state, setState] = useState({
    username: '',
    password: '',
    error: null
  });
  const [signIn, { loading }] = useMutation(SIGN_IN);
  const [logUserIn] = useMutation(LOG_USER_IN);
  const { t } = useTranslation();

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value })
  };

  const onSubmit = event => {
    event.preventDefault();
    let phone;
    let email;
    if (state.username.match(isValidPhone)) {
      phone = state.username;
    } else {
      email = state.username;
    }
    signIn({
      variables: {
        email,
        phone,
        password: state.password
      },
      update: (_, result) => {
        const { data: { signIn } } = result;
        const token = signIn.token;
        if (signIn.error) {
          setState({ ...state, error: signIn.error });
          return false;
        }
        if (signIn.token) {
          logUserIn({
            variables: {
              token
            },
            update: (_, __) => {
              window.location.reload();
            }
          })
        }
      }
    })
  };

  const { data: { darkMode } } = useQuery(DARK_MODE);

  return (
    <div className={style.Content}>
      <Helmet>
        <title>{ t('Sign In') } | Magergram</title>
      </Helmet>
      <div className={style.Box}>
        <MainLogo darkMode={darkMode} />
        <div className={style.Controls}>
          <form className={style.Form} method="post" onSubmit={onSubmit}>
            <div className={style.SpacingL} />
            <div className={style.Control}>
              <Input
                placeholder={t('Phone number, username or email')}
                name="username"
                value={state.username}
                required
                onChange={handleChange('username')}
              />
            </div>
            <div className={style.Control}>
              <Input
                type="password"
                placeholder={t('Password')}
                name="password"
                value={state.password}
                required
                onChange={handleChange('password')}
              />
            </div>
            <div className={style.Submit}>
              <Button
                label={t('Login')}
                disabled={(!state.username || state.password.length < 6) || loading}
              />
            </div>
            <Separator text={t('or')} />
            <div className={style.SocialLogin}>
              <button className={style.FacebookButton} onClick={() => alert('Coming soon ...')}>
                <span className={`${style.FacebookIcon} sprite`} />
                <span className={style.FacebookText}>{t('Login with Facebook')}</span>
              </button>
            </div>
            { state.error &&
              <div className={style.Error}>
                <p role="alert">
                  { t(state.error) }
                </p>
              </div>
            }
            <Link to="/recovery-password" className={style.ForgotPassword}>{t('Forgot password')}?</Link>
          </form>
        </div>
      </div>
      <div className={style.Box}>
        <AuthFooter
          text="Don't have an account?"
          linkText="Sign Up"
          linkPath="/signup"
        />
      </div>
      {/*<AppButtons />*/}
    </div>
  )
};
