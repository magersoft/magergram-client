import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import style from './Profile.module.scss';
import { Button, Image } from '../../components/UI';
import SettingIcon from '../../components/Icon/SettingIcon';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { CANCEL_FOLLOW, FOLLOW, REQUEST_FOLLOW, SEE_USER, SEE_USER_POSTS, UNFOLLOW } from './ProfileQuery';
import Dialog from '../../components/Dialog/Dialog';
import DialogButton from '../../components/Dialog/DialogButton';
import { LOG_USER_OUT } from '../../apollo/GlobalQueries';
import PostCard from '../../components/PostCard';
import { FavoriteIcon, PortretIcon, PostsIcon } from '../../components/Icon';
import EmptyPosts from '../../components/EmptyPosts';
import SkeletonAvatar from '../../components/Skeleton/SkeletonAvatar';
import SkeletonString from '../../components/Skeleton/SkeletonString';
import ButtonSkeleton from '../../components/UI/Button/ButtonSkeleton';
import UserCard from '../../components/UserCard';
import { ProfileBio, ProfileStats } from '../../components/ProfileModules';
import Spinner from '../../components/Loader/Spinner';
import SkeletonBlock from '../../components/Skeleton/SkeletonBlock/SkeletonBlock';
import UploadAvatar from '../../components/UploadAvatar';
import PrivateAccount from '../../components/PrivateAccount';

const PER_PAGE_POST = 8;

export default ({ history, location }) => {
  const username = location.pathname.replace('/', '');
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [noMorePosts, setNoMorePosts] = useState(false);
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

  const { data, loading } = useQuery(SEE_USER, {
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
    },
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    if (dataPosts) {
      const { seeUserPosts } = dataPosts;
      if (seeUserPosts) {
        setPosts(seeUserPosts);
      }
    }
  }, [dataPosts]);

  const [follow, { loading: followLoading }] = useMutation(FOLLOW);
  const [unFollow, { loading: unFollowLoading }] = useMutation(UNFOLLOW);
  const [requestFollow, { loading: requestFollowLoading }] = useMutation(REQUEST_FOLLOW);
  const [cancelFollow, { loading: cancelFollowLoading }] = useMutation(CANCEL_FOLLOW);
  const [logOut] = useMutation(LOG_USER_OUT);

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

  const handleClickAvatar = () => {
    if (!profile.isSelf) return;
    setDialogChangePhoto(true);
  };

  const handleFollowClick = () => {
    if (profile.isPrivate) {
      requestFollow({
        variables: {
          subscriberId: profile.id
        },
        update: (_, result) => {
          const { data: { requestFollow } } = result;
          if (requestFollow) {
            setProfile({
              ...profile,
              isRequestingSubscription: true
            })
          }
        }
      })
    } else {
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
    }
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

  const handleCancelFollowClick = () => {
    cancelFollow({
      variables: {
        subscriberId: profile.id
      },
      update: (_, result) => {
        const { data: { cancelFollow } } = result;
        if (cancelFollow) {
          setProfile({
            ...profile,
            isRequestingSubscription: false
          })
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
                  { profile && profile.isSelf ?
                    <React.Fragment>
                      <Button
                        label={t('Edit profile')}
                        type="secondary"
                        className={style.ProfileEdit}
                        onClick={() => history.push('/edit-profile')}
                      />
                      <button className={style.ProfileSettingIcon} onClick={handleSettingsClick}>
                        <SettingIcon width="24" height="24" color="var(--color-main)" />
                      </button>
                    </React.Fragment>
                    : profile.isFollowing
                      ? <Button
                          label={t('Unfollow')}
                          type="secondary"
                          disabled={unFollowLoading}
                          className={style.ProfileEdit}
                          onClick={handleUnFollowClick}
                        />
                      : profile.isRequestingSubscription
                        ? <Button
                            label={t('Request send')}
                            type="secondary"
                            disabled={cancelFollowLoading}
                            className={style.ProfileEdit}
                            onClick={handleCancelFollowClick}
                          />
                        : <Button
                            label={t('Follow')}
                            disabled={followLoading || requestFollowLoading}
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
          <article className={style.Posts}>
            { posts && !loadingPosts ?
              <InfiniteScroll
                pageStart={0}
                loadMore={handleFetchMore}
                hasMore={!noMorePosts}
                initialLoad={false}
                className={posts.length ? style.Grid : null}
                loader={
                  <div key={0} className={style.MoreLoading}>
                    { posts.length ? <Spinner width={50} height={50}/> : null }
                  </div>
                }
              >
                { posts.map(post => {
                  const {id, caption, likeCount, commentCount, files} = post;
                  return <PostCard
                    id={id}
                    caption={caption}
                    files={files}
                    likeCount={likeCount}
                    commentCount={commentCount}
                    key={id}
                  />
                }) }
              </InfiniteScroll> :
              <div className={style.Grid}>
                { [...Array(9).keys()].map(idx => <SkeletonBlock maxHeight={293} maxWidth={293} key={idx} />) }
              </div>
            }
            { !posts.length && !loadingPosts && (profile && !profile.isPrivate) && <EmptyPosts /> }
            { !posts.length && !loadingPosts && (profile && profile.isPrivate) && <PrivateAccount /> }
          </article>
      </div>
      { profile && profile.isSelf &&
        <React.Fragment>
          <UploadAvatar
            avatar={profile.avatar}
            dialogShow={dialogChangePhoto}
            dialogClose={() => setDialogChangePhoto(false)}
            avatarUpdated={avatar => setProfile({ ...profile, avatar })}
          />
          <Dialog show={dialogSettings}>
            <DialogButton
              text={t('Logout')}
              onClick={handleLogoutClick}
            />
            <DialogButton
              text={t('Change password')}
              onClick={() => history.push('/edit-profile/password')}
            />
            <DialogButton
              text={t('Confidential and security')}
              onClick={() => history.push('/edit-profile/security')}
            />
            <DialogButton
              text={t('Application settings')}
              onClick={() => history.push('/edit-profile/settings')}
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
          const { username, avatar, fullName, isFollowing, id, isSelf, isPrivate, isRequestingSubscription } = follower;
          return <UserCard
            username={username}
            id={id}
            fullName={fullName}
            avatar={avatar}
            itsMe={isSelf}
            isRequestingSubscription={isRequestingSubscription}
            isPrivate={isPrivate}
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
          const { username, avatar, fullName, isFollowing, id, isSelf, isPrivate, isRequestingSubscription } = following;
          return <UserCard
            username={username}
            id={id}
            fullName={fullName}
            avatar={avatar}
            itsMe={isSelf}
            isRequestingSubscription={isRequestingSubscription}
            isPrivate={isPrivate}
            isFollowing={isFollowing}
            key={id}
          />
        }) }
      </Dialog>
    </React.Fragment>
  )
};
