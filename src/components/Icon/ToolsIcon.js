import React from 'react';
import style from './IconStyle.module.scss'

export default ({ width, height, color }) => (
  <svg fill={color} height={height} width={width} className={style.Icon} viewBox="0 0 48 48" >
    <circle clipRule="evenodd" cx="8" cy="24" fillRule="evenodd" r="4.5" />
    <circle clipRule="evenodd" cx="24" cy="24" fillRule="evenodd" r="4.5" />
    <circle clipRule="evenodd" cx="40" cy="24" fillRule="evenodd" r="4.5" />
  </svg>
)
