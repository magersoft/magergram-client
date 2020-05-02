import React from 'react';
import style from './IconStyle.module.scss'

export default ({ width, height, color }) => (
    <svg className={style.Icon} fill={color} height={height} viewBox="0 0 48 48" width={width}>
      <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 28.9 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1z" />
    </svg>
)
