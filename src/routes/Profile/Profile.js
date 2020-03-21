import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import style from './Profile.module.scss';
import { Button, Image } from '../../components/UI';
import SettingIcon from '../../components/Icon/SettingIcon';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FOLLOW, SEE_USER, UNFOLLOW, UPDATE_AVATAR } from './ProfileQuery';
import Dialog from '../../components/Dialog/Dialog';
import DialogButton from '../../components/Dialog/DialogButton';
import { DELETE_FILE, LOG_USER_OUT, UPLOAD_FILE } from '../../apollo/GlobalQueries';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';
import PostCard from '../../components/PostCard';
import { FavoriteIcon, PortretIcon, PostsIcon } from '../../components/Icon';
import EmptyPosts from '../../components/EmptyPosts';
import SkeletonAvatar from '../../components/Skeleton/SkeletonAvatar';
import SkeletonString from '../../components/Skeleton/SkeletonString';
import ButtonSkeleton from '../../components/UI/Button/ButtonSkeleton';

export default ({ history, location }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [itsMe, setItsMe] = useState(false);
  const [dialogChangePhoto, setDialogChangePhoto] = useState({
    show: false
  });
  const [dialogSettings, setDialogSettings] = useState({
    show: false
  });

  useEffect(() => {
    const { pathname } = location;
    if (!pathname) {
      history.push('/')
    }
  }, [location, history]);

  const { data, client } = useQuery(SEE_USER, {
    variables: {
      username: location.pathname.replace('/', '')
    },
    fetchPolicy: 'network-only'
  });
  const [singleUpload, { loading: singleUploadLoading }] = useMutation(UPLOAD_FILE);
  const [deleteFile, { loading: deleteFileLoading }] = useMutation(DELETE_FILE);
  const [updateAvatar, { loading: updateAvatarLoading }] = useMutation(UPDATE_AVATAR);
  const [follow, { loading: followLoading }] = useMutation(FOLLOW);
  const [unFollow, { loading: unFollowLoading }] = useMutation(UNFOLLOW);
  const [logOut] = useMutation(LOG_USER_OUT);

  useEffect(() => {
    if (data) {
      const { seeUser } = data;
      if (seeUser) {
        setProfile(seeUser);
      }
    }
  }, [data]);

  useEffect(() => {
    if (profile) {
      const { myProfile } = client.cache.readQuery({ query: MY_PROFILE });
      setItsMe(profile.id === myProfile.id);
    }
  }, [profile, client]);


  const updateAvatarHelper = avatar => {
    updateAvatar({
      variables: {
        avatar
      },
      update: (cache, result) => {
        const { data: { editUser } } = result;
        if (editUser) {
          try {
            const { myProfile } = cache.readQuery({ query: MY_PROFILE });
            if (myProfile) {
              const updated = { ...myProfile, avatar: editUser.avatar };
              cache.writeQuery({ query: MY_PROFILE, data: { myProfile: updated } });
            }
          } catch (e) {
            console.log(e);
          }
          setProfile({ ...profile, avatar: editUser.avatar });
          setDialogChangePhoto({ ...dialogChangePhoto, show: false });
        }
      }
    })
  };

  const handleClickAvatar = () => {
    if (!itsMe) return;
    setDialogChangePhoto({ ...dialogChangePhoto, show: true });
  };
  const fileInputRef = useRef();

  const handleClickUploadPhotoButton = () => {
    fileInputRef.current.click();
  };

  const handleFollowClick = () => {
    follow({
      variables: {
        id: profile.id
      },
      update: (_, result) => {
        const { data: { follow } } = result;
        if (follow) {
          setProfile({
            ...profile,
            isFollowing: true,
            followersCount: profile.followersCount + 1
          })
        }
      }
    })
  };

  const handleUnFollowClick = () => {
    unFollow({
      variables: {
        id: profile.id
      },
      update: (_, result) => {
        const { data: { unfollow } } = result;
        if (unfollow) {
          setProfile({
            ...profile,
            isFollowing: false,
            followersCount: profile.followersCount - 1
          })
        }
      }
    })
  };

  const handleInputFileChange = event => {
    const { validity, files: [file] } = event.target;
    if (validity.valid) {
      singleUpload({
        variables: {
          file
        },
        update: (_, result) => {
          const { data: { singleUpload } } = result;
          if (singleUpload) {
            updateAvatarHelper(singleUpload.path)
          }
        }
      })
    }
  };

  const handleClickRemovePhotoButton = () => {
    const filename = profile.avatar.replace('/static/', '');
    deleteFile({
      variables: {
        filename
      },
      update: (_, result) => {
        const { data: { fileDelete } } = result;
        if (fileDelete) {
          updateAvatarHelper('')
        }
      }
    })
  };

  const handleSettingsClick = () => {
    setDialogSettings({ show: true });
  };

  const handleLogoutClick = () => {
    logOut();
  };

  return (
    <React.Fragment>
      <div className="container">
        <header className={style.Header}>
          <div className={style.ProfilePhoto}>
            <div className={style.ProfilePhotoContainer}>
              <div className={style.ProfilePhotoBlock}>
                <button className={style.ProfilePhotoChange} title={t('Change profile photo')} onClick={handleClickAvatar}>
                  { profile ?
                    <Image src={profile.avatar || NoAvatarImg} alt={t('Change profile photo')} />
                    :
                    <SkeletonAvatar height={150} width={150} />
                  }
                </button>
              </div>
            </div>
          </div>
          <section className={style.Profile}>
            <div className={style.ProfileSettings}>
              { profile ? <h1>{ profile.username }</h1> : <SkeletonString height={25} width={150} /> }
              { profile ?
                <React.Fragment>
                  { itsMe ?
                    <React.Fragment>
                      <Button
                        label={t('Edit profile')}
                        type="secondary"
                        className={style.ProfileEdit}
                        onClick={() => history.push('/edit-profile')}
                      />
                      <button className={style.ProfileSettingIcon} onClick={handleSettingsClick}>
                        <SettingIcon width="24" height="24" color="var(--blackColor)" />
                      </button>
                    </React.Fragment>
                    : profile.isFollowing ?
                      <Button
                        label={t('Unfollow')}
                        type="secondary"
                        disabled={unFollowLoading}
                        className={style.ProfileEdit}
                        onClick={handleUnFollowClick}
                      /> : <Button
                        label={t('Follow')}
                        disabled={followLoading}
                        className={style.ProfileEdit}
                        onClick={handleFollowClick}
                      />
                  }
                </React.Fragment>
                : <ButtonSkeleton width={200} className={style.SkeletonButton} />
              }
            </div>
            <ul className={style.ProfileInfo}>
              <li className={style.ProfileInfoStat}>
                { profile ?
                  <span>
                    <span>{ profile.postsCount }</span>
                    &nbsp;{ t('Publications') }
                  </span> : <SkeletonString height={16} width={100} />
                }
              </li>
              <li className={style.ProfileInfoStat}>
                { profile ?
                  <span>
                    <span>{ profile.followersCount }</span>
                    &nbsp;{ t('Followers') }
                  </span> : <SkeletonString height={16} width={100} />
                }
              </li>
              <li className={style.ProfileInfoStat}>
                { profile ?
                  <span>
                    <span>{ profile.followingCount }</span>
                    &nbsp;{ t('Following') }
                  </span> : <SkeletonString height={16} width={100} />
                }
              </li>
            </ul>
            <div className={style.ProfileBio}>
              { profile ?
                <React.Fragment>
                  <h2>{ profile.fullName }</h2>
                  { profile.bio && <span>{ profile.bio }</span> }
                  { profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer">{ profile.website }</a> }
                </React.Fragment>
                : <SkeletonString height={16} width={300} />
              }
            </div>
          </section>
        </header>
        <div className="stories" style={{marginBottom: 40}}>
          {/*{ todo: Stories }*/}
        </div>
        <div className={style.Navigation}>
          <div className={style.NavigationItem + ' ' + style.active}>
            <span className={style.NavigationIcon}>
              <PostsIcon width={12} height={12} />
              <span>{ t('Publication') }</span>
            </span>
          </div>
          <div className={style.NavigationItem}>
            <span className={style.NavigationIcon}>
              <FavoriteIcon width={12} height={12} />
              <span>{ t('Saved') }</span>
            </span>
          </div>
          <div className={style.NavigationItem}>
            <span className={style.NavigationIcon}>
              <PortretIcon width={12} height={12} />
              <span>{ t('Mark') }</span>
            </span>
          </div>
        </div>
        { profile &&
          <article className={style.Posts}>
          <div className={style.Grid}>
            { profile.posts.map(post => {
              const { id, caption, likeCount, commentCount, files } = post;
              return <PostCard
                id={id}
                caption={caption}
                files={files}
                likeCount={likeCount}
                commentCount={commentCount}
                key={id}
              />
            }) }
          </div>
          { !profile.posts.length && <EmptyPosts /> }
        </article>
        }
      </div>
      { itsMe && dialogChangePhoto.show &&
        <Dialog title={t('Change profile photo')}>
          <DialogButton
            text={t('Upload photo')}
            type="info"
            loading={singleUploadLoading || updateAvatarLoading}
            disabled={singleUploadLoading || updateAvatarLoading}
            onClick={handleClickUploadPhotoButton}
          />
          { profile.avatar &&
            <DialogButton
              text={t('Remove current photo')}
              type="danger"
              loading={deleteFileLoading || updateAvatarLoading}
              disabled={deleteFileLoading || updateAvatarLoading}
              onClick={handleClickRemovePhotoButton}
            />
          }
          <DialogButton
            text={t('Cancel')}
            onClick={() => setDialogChangePhoto({ ...dialogChangePhoto, show: false })}
          />
          <form method="POST" encType="multipart/form-data" className={style.UploadPhotoForm}>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleInputFileChange} />
          </form>
        </Dialog>
      }
      {
        itsMe && dialogSettings.show &&
        <Dialog>
          <DialogButton
            text={t('Logout')}
            onClick={handleLogoutClick}
          />
          <DialogButton
            text={t('Dark theme')}
          />
          <DialogButton
            text={t('Cancel')}
            onClick={() => setDialogSettings({ ...dialogSettings, show: false })}
          />
        </Dialog>
      }
    </React.Fragment>
  )
};
