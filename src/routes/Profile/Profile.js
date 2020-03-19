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
import { DELETE_FILE, UPLOAD_FILE } from '../../apollo/GlobalQueries';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';
import PostCard from '../../components/PostCard';

export default ({ history, location }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [itsMe, setItsMe] = useState(false);
  const [dialogChangePhoto, setDialogChangePhoto] = useState({
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

  return (
    <React.Fragment>
      <div className="container">
        { !profile ?
          <div>Loading ...</div>
          :
          <React.Fragment>
            <header className={style.Header}>
              <div className={style.ProfilePhoto}>
                <div className={style.ProfilePhotoContainer}>
                  <div className={style.ProfilePhotoBlock}>
                    <button className={style.ProfilePhotoChange} title={t('Change profile photo')} onClick={handleClickAvatar}>
                      <Image src={profile.avatar || NoAvatarImg} alt={t('Change profile photo')} />
                    </button>
                  </div>
                </div>
              </div>
              <section className={style.Profile}>
                <div className={style.ProfileSettings}>
                  <h1>{ profile.username }</h1>
                  { itsMe ?
                    <React.Fragment>
                      <Button
                        label={t('Edit profile')}
                        type="secondary"
                        className={style.ProfileEdit}
                        onClick={() => history.push('/edit-profile')}
                      />
                      <button className={style.ProfileSettingIcon}>
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
                </div>
                <ul className={style.ProfileInfo}>
                  <li className={style.ProfileInfoStat}>
                    <span>
                      <span>{ profile.postsCount }</span>
                      &nbsp;{ t('publications') }
                    </span>
                  </li>
                  <li className={style.ProfileInfoStat}>
                    <span>
                      <span>{ profile.followersCount }</span>
                      &nbsp;{ t('followers') }
                    </span>
                  </li>
                  <li className={style.ProfileInfoStat}>
                    <span>
                      <span>{ profile.followingCount }</span>
                      &nbsp;{ t('following') }
                    </span>
                  </li>
                </ul>
                <div className={style.ProfileBio}>
                  <h2>{ profile.fullName }</h2>
                  { profile.bio && <span>{ profile.bio }</span> }
                  { profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer">{ profile.website }</a> }
                </div>
              </section>
            </header>
            <div className="stories">
              {/*{ todo: Stories }*/}
            </div>
            <div className={style.Navigation}>

            </div>
            <article className={style.Posts}>
              <div className={style.Grid}>
                { profile.posts.map(post => {
                  const { id, caption, files } = post;
                  return <PostCard id={id} caption={caption} files={files} key={id} />
                }) }
              </div>
            </article>
          </React.Fragment>
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
    </React.Fragment>
  )
};
