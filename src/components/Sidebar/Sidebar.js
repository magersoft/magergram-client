import React from 'react';
import style from './Sidebar.module.scss';

export default ({ leftFixedPosition }) => {
  return (
    <div
      className={style.Sidebar}
      style={{ left: leftFixedPosition }}>
      Sidebar
    </div>
  )
}
