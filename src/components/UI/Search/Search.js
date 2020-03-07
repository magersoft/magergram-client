import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './Search.module.scss';

export default () => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    focus: false,
    value: ''
  });

  const inputRef = useRef();

  const onFocusInput = () => {
    setState({ ...state, focus: true });
    inputRef.current.focus();
  };

  const onBlurInput = () => {
    setState({ ...state, focus: false })
  };

  const onChangeInput = event => {
    setState({ ...state, value: event.target.value })
  };

  const clearHandler = () => {
    setState({ ...state, focus: false, value: '' })
  };

  return (
    <React.Fragment>
      <input
        ref={inputRef}
        type="text"
        autoCapitalize="none"
        className={style.Input}
        value={state.value}
        onChange={onChangeInput}
        placeholder={t('Search')}
      />
      { state.focus ?
        <React.Fragment>
          <span className={`${style.MiniIcon} sprite`} />
          <div className={style.Overlay} role="dialog" onClick={onBlurInput} />
          <div className={style.Dropdown}>
            Search item ...
          </div>
          <div className={`${style.Clear} sprite`} role="button" tabIndex="0" onClick={clearHandler} />
        </React.Fragment>
        :
        <div className={style.Container} onClick={onFocusInput}>
          <div className={style.Inner}>
            <span className={`${style.Icon} sprite`} />
            <span className={style.Placeholder}>{ state.value ? state.value : t('Search') }</span>
          </div>
        </div>
      }
    </React.Fragment>
  )
};
