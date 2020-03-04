import React, { useState } from 'react';
import style from './Auth.module.scss';
import Input from '../../components/UI/Input/Input';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button/Button';

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
              <h1 className={style.Title}>Magergram</h1>
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
                    <Button label={t('Log In')} disabled={!state.username || !state.password} />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
};
