import React from 'react';
import style from './BottomNavigation.module.scss';
import { Button } from '../UI';

export default () => {

  return (
    <nav className={style.Navigation}>
      <div className={style.Container}>
        <Button label="Add Post" small />
      </div>
    </nav>
  )
};
