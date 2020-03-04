import React, { useState } from 'react';
import style from './Auth.module.scss';
import Input from '../../components/UI/Input/Input';
import { useTranslation } from 'react-i18next';

export default () => {
  const [action, setAction] = useState("logIn");
  const { t } = useTranslation();

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
                    />
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
