import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, AppButtons } from '../../components/UI';
import style from './Auth.module.scss';

export default () => {
  const [action, setAction] = useState("logIn");
  const [state, setState] = useState({
    username: '',
    password: ''
  });
  const { t } = useTranslation();

  const handleChange = prop => event => {
    setState({ ...state, [prop]: event.target.value })
  };

  return (
    <main className={style.Main} role="main">
      <div className={style.Wrapper}>
        <article className={style.Article}>
          <div className={style.Content}>
            <div className={style.Box}>
              <h1 className={`${style.Title} sprite`}>Magergram</h1>
              <div className={style.Controls}>
                <form className={style.Form} method="post">
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
                  <div className={style.OrBlock}>
                    <div className={style.Separator} />
                    <div className={style.Or}>{ t('or') }</div>
                    <div className={style.Separator} />
                  </div>
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
                  { t('You are not account') }?
                  <Link to="/" >
                    <span className={style.SignUpLink}>{t('Sign Up')}</span>
                  </Link>
                </p>
              </div>
            </div>
            <AppButtons />
          </div>
        </article>
      </div>
    </main>
  )
};
