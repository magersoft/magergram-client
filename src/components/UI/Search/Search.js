import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './Search.module.scss';
import { useLazyQuery } from '@apollo/react-hooks';
import { SEARCH_USERS } from './SearhQueries';
import UserCard from '../../UserCard';
import Spinner from '../../Loader/Spinner';

export default () => {
  const { t } = useTranslation();

  const [state, setState] = useState({
    focus: false,
    value: '',
    users: []
  });

  const inputRef = useRef();

  const [searchUsers, { data: dataUsers, loading: loadingUsers }] = useLazyQuery(SEARCH_USERS);
  useEffect(() => {
    if (dataUsers) {
      const {searchUsers} = dataUsers;
      if (searchUsers.length) {
        setState(state => ({...state, users: searchUsers}))
      } else {
        setState(state => ({...state, users: []}));
      }
    }
  }, [dataUsers]);

  const handleSearch = () => {
    const term = state.value;
    if (term.length) {
      searchUsers({
        variables: {
          term
        }
      });
    }
  };

  const onFocusInput = () => {
    setState({ ...state, focus: true });
    inputRef.current.focus();
    handleSearch();
  };

  const onBlurInput = () => {
    setState({ ...state, focus: false, users: [] });
  };

  const onChangeInput = event => {
    setState({ ...state, value: event.target.value });
    handleSearch();
  };

  const clearHandler = () => {
    setState({ ...state, focus: false, value: '', users: [] })
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
          { state.users.length ?
          <div className={style.Dropdown}>
            <div className={style.DropdownArrow} />
            <div className={style.DropdownBlock}>
              <div className={style.DropdownContainer}>
                { state.users && !loadingUsers ?
                  state.users.map(user => {
                    const { id, username, avatar, fullName } = user;
                    return <UserCard
                      id={id}
                      username={username}
                      avatar={avatar}
                      fullName={fullName}
                      key={id}
                    />
                  }) : <div className={style.Loading}><Spinner /></div>
                }
              </div>
            </div>
          </div> : null
          }
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
