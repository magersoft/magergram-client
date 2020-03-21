import React from 'react';
import style from './EmptyPosts.module.scss';

export default () => {
  return (
    <div className={style.EmptyPost}>
      <div className={style.Icon}>
        <span className={`${style.IconPhoto} sprite-glyphs`} />
      </div>
      <div className={style.Text}>
        <span>Публикаций пока нет</span>
      </div>
    </div>
  )
};
