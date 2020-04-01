import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import style from './Profile.module.scss';
import { Button, Image } from '../../components/UI';
import SettingIcon from '../../components/Icon/SettingIcon';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FOLLOW, SEE_USER, SEE_USER_POSTS, UNFOLLOW, UPDATE_AVATAR } from './ProfileQuery';
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
import UserCard from '../../components/UserCard';
import { ProfileBio, ProfileStats } from '../../components/ProfileModules';
import Spinner from '../../components/Loader/Spinner';

const PER_PAGE_POST = 8;

export default ({ history, location }) => {
  const username = location.pathname.replace('/', '');
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [itsMe, setItsMe] = useState(false);
  const [dialogChangePhoto, setDialogChangePhoto] = useState(false);
  const [dialogSettings, setDialogSettings] = useState(false);
  const [dialogFollowers, setDialogFollowers] = useState(false);
  const [dialogFollowing, setDialogFollowing] = useState(false);

  useEffect(() => {
    const { pathname } = location;
    if (!pathname) {
      history.push('/')
    }
    setDialogFollowers(false);
    setDialogFollowing(false);
    setDialogChangePhoto(false);
    setDialogSettings(false);
  }, [location, history]);

  const fileInputRef = useRef();

  const { data, client, loading } = useQuery(SEE_USER, {
    variables: {
      username
    },
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    if (data) {
      const { seeUser } = data;
      if (seeUser) {
        setProfile(seeUser);
      }
    }
  }, [data]);

  const { data: dataPosts, loading: loadingPosts, fetchMore } = useQuery(SEE_USER_POSTS, {
    variables: {
      username,
      perPage: PER_PAGE_POST,
      page: 0
    }
  });
  useEffect(() => {
    if (dataPosts) {
      const { seeUserPosts } = dataPosts;
      if (seeUserPosts) {
        setPosts(seeUserPosts);
      }
    }
  }, [dataPosts]);

  const [singleUpload, { loading: singleUploadLoading }] = useMutation(UPLOAD_FILE);
  const [deleteFile, { loading: deleteFileLoading }] = useMutation(DELETE_FILE);
  const [updateAvatar, { loading: updateAvatarLoading }] = useMutation(UPDATE_AVATAR);
  const [follow, { loading: followLoading }] = useMutation(FOLLOW);
  const [unFollow, { loading: unFollowLoading }] = useMutation(UNFOLLOW);
  const [logOut] = useMutation(LOG_USER_OUT);

  useEffect(() => {
    if (profile) {
      const { myProfile } = client.cache.readQuery({ query: MY_PROFILE });
      setItsMe(profile.id === myProfile.id);
    }
  }, [profile, client]);

  const handleFetchMore = async page => {
    try {
      await fetchMore({
        variables: {
          perPage: PER_PAGE_POST,
          page
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevResult;
          }
          if (!fetchMoreResult.seeUserPosts.length) {
            setNoMorePosts(true);
          }
          return {
            ...prevResult,
            seeUserPosts: [ ...prevResult.seeUserPosts, ...fetchMoreResult.seeUserPosts ]
          };
        }
      })
    } catch {}
  };

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
          setDialogChangePhoto(false);
        }
      }
    })
  };

  const handleClickAvatar = () => {
    if (!itsMe) return;
    setDialogChangePhoto(true);
  };

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
    if (validity.valid && file) {
      singleUpload({
        variables: {
          file,
          toGoogleStorage: true,
          optimized: [300, 300]
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
    const src = profile.avatar;
    deleteFile({
      variables: {
        src
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
    setDialogSettings(true);
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
                  { profile && !loading ?
                    <Image src={profile.avatar || NoAvatarImg} alt={t('Change profile photo')} />
                    :
                    <SkeletonAvatar maxHeight={150} maxWidth={150} />
                  }
                </button>
              </div>
            </div>
          </div>
          <section className={style.Profile}>
            <div className={style.ProfileSettings}>
              { profile && !loading ? <h1>{ profile.username }</h1> : <SkeletonString height={25} width={150} /> }
              { profile && !loading ?
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
            <ProfileStats
              profile={profile}
              loading={loading}
              onDialogFollowing={() => setDialogFollowing(true)}
              onDialogFollowers={() => setDialogFollowers(true)}
            />
            <ProfileBio profile={profile} loading={loading} />
          </section>
        </header>
        <ProfileBio profile={profile} isMobile loading={loading} />
        <div className="stories" style={{marginBottom: 40}}>
          {/*{ todo: Stories }*/}
        </div>
        <ProfileStats
          profile={profile}
          isMobile
          loading={loading}
          onDialogFollowing={() => setDialogFollowing(true)}
          onDialogFollowers={() => setDialogFollowers(true)}
        />
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
        { posts && !loadingPosts &&
          <article className={style.Posts}>
            <InfiniteScroll
              pageStart={0}
              loadMore={handleFetchMore}
              hasMore={!noMorePosts}
              className={posts.length ? style.Grid : null}
              loader={
                <div key={0} className={style.MoreLoading}>
                  { posts.length ? <Spinner width={50} height={50} /> : null }
                </div>
              }
            >
              { posts.map(post => {
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
            </InfiniteScroll>
          { !posts.length && <EmptyPosts /> }
          </article>
        }
      </div>
      { itsMe &&
        <React.Fragment>
          <Dialog show={dialogChangePhoto} title={t('Change profile photo')}>
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
            onClick={() => setDialogChangePhoto(false)}
          />
          <form method="POST" encType="multipart/form-data" className={style.UploadPhotoForm}>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleInputFileChange} />
          </form>
        </Dialog>
          <Dialog show={dialogSettings}>
            <DialogButton
              text={t('Logout')}
              onClick={handleLogoutClick}
            />
            <DialogButton
              text={t('Dark theme')}
            />
            <DialogButton
              text={t('Cancel')}
              onClick={() => setDialogSettings(false)}
            />
          </Dialog>
        </React.Fragment>
      }
      <Dialog
        show={dialogFollowers}
        title={t('Followers_many')}
        withScrollingData
        fullScreen
        onClose={() => setDialogFollowers(false)}
      >
        { profile && profile.followers.map(follower => {
          const { username, avatar, fullName, isFollowing, id } = follower;
          return <UserCard
            username={username}
            id={id}
            fullName={fullName}
            avatar={avatar}
            itsMe={itsMe}
            isFollowing={isFollowing}
            key={id}
          />
        }) }
      </Dialog>
      <Dialog
        show={dialogFollowing}
        title={t('Following')}
        withScrollingData
        fullScreen
        onClose={() => setDialogFollowing(false)}
      >
        { profile && profile.following.map(following => {
          const { username, avatar, fullName, isFollowing, id } = following;
          return <UserCard
            username={username}
            id={id}
            fullName={fullName}
            avatar={avatar}
            itsMe={itsMe}
            isFollowing={isFollowing}
            key={id}
          />
        }) }
      </Dialog>
    </React.Fragment>
  )
};
