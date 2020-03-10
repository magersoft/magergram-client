import React from 'react';
import style from './styles/PostSkeleton.module.scss';

export default () => (
  <div className={style.Post}>
    <header className={style.Header}>
      <div className={style.Avatar}>
        <div className={style.LinkToUser}>
          <div className={style.AvatarImg} />
        </div>
      </div>
      <div className={style.UserInfo}>
        <div className={style.Username}>
          <div className={style.UsernameWrap} />
        </div>
        <div className={style.Location}>
          <div />
        </div>
      </div>
    </header>
    <div className={style.Content} />
  </div>
)
