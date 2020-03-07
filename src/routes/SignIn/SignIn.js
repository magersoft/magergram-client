import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, AppButtons, Separator } from '../../components/UI';
import { useMutation } from '@apollo/react-hooks';
import { SIGN_IN } from './SignInQueries';
import style from './SignIn.module.scss';
import { LOG_USER_IN } from '../../apollo/GlobalQueries';
import { isValidPhone } from '../../utils/phoneRegExp';

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
              <button className={style.FacebookButton}>
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
