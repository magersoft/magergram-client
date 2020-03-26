import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../UI';
import style from './BottomNavigation.module.scss';

export default () => {

  return (
    <nav className={`${style.Navigation} bottom-navigation`}>
      <div className={style.Container}>
        <Link to="/add-post">
          <Button label="Add Post" small />
        </Link>
      </div>
    </nav>
  )
};
