import React from 'react';
import { NewStoryIcon } from '../Icon';
import style from './EmptyPosts.module.scss';

export default () => {
  return (
    <div className={style.EmptyPost}>
      <div className={style.Icon}>
        <NewStoryIcon width={24} height={24} color="var(--color-main)" />
      </div>
      <div className={style.Text}>
        <span>Публикаций пока нет</span>
      </div>
    </div>
  )
};
