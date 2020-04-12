import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import cx from 'classnames';
import style from './BottomNavigation.module.scss';
import { useTranslation } from 'react-i18next';
import { AddPostIcon, HomeIcon, LikeIcon, SearchPeopleIcon } from '../Icon';
import { Image } from '../UI';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { useMutation } from '@apollo/react-hooks';
import { UPLOAD_FILE } from '../../apollo/GlobalQueries';

export default ({ user }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  const [state, setState] = useState({
    user: null
  });

  const [singleUpload, { loading: singleUploadLoading }] = useMutation(UPLOAD_FILE);

  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setState(prevState => ({ ...prevState, user }));
    }
  }, [user]);

  const handleActivityClick = () => {
      setState(prevState => ({
        ...prevState,
        user: {
          ...prevState.user,
          newNotificationsCount: 0
        }
      }))
  };

  const handleClickUploadPhoto = () => {
    fileInputRef.current.click();
  }

  const handleInputFileChange = event => {
    const { validity, files: [file] } = event.target;
    if (validity.valid && file) {
      singleUpload({
        variables: {
          file
        },
        update: (_, result) => {
          const { data: { singleUpload } } = result;
          if (singleUpload) {
            const file = singleUpload.path;
            history.push('/add-post', { file })
          }
        }
      })
    }
  }

  return (
    <nav className={`${style.Navigation} bottom-navigation`}>
      <div className={style.iOS11fix} />
      <div className={style.Container}>
        <div className={cx(style.Button, style.Home)}>
          <Link to="/" className={style.Link} title={t('Home')}>
            <HomeIcon width={24} height={24} color="var(--color-main)" active={pathname === '/'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.Explore)}>
          <Link to="/explore" className={style.Link} title={t('Explore')}>
            <SearchPeopleIcon width={24} height={24} color="var(--color-main)" active={pathname === '/explore'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.AddPost)}>
          <button className={style.Link} title={t('Add Post')} disabled={singleUploadLoading} onClick={handleClickUploadPhoto}>
            <AddPostIcon width={24} height={24} color="var(--color-main)" />
            <form method="POST" encType="multipart/form-data" className={style.UploadPhotoForm}>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleInputFileChange} />
            </form>
          </button>
        </div>
        <div className={cx(style.Button, style.Activity)}>
          { state.user && state.user.newNotificationsCount !== 0 &&
            <div className={style.NewNotificationsCount}>
              <span>{ state.user.newNotificationsCount }</span>
            </div>
          }
          <Link to="/activity" className={style.Link} title={t('Activity')} onClick={handleActivityClick}>
            <LikeIcon width={24} height={24} color="var(--color-main)" active={pathname === '/activity'} />
          </Link>
        </div>
        <div className={cx(style.Button, style.User)}>
          { state.user &&
          <Link to={`/${state.user.username}`} className={style.UserProfile}>
            <Image src={state.user.avatar || NoAvatarImg} alt="Avatar profile" />
          </Link>
          }
        </div>
      </div>
    </nav>
  )
};
