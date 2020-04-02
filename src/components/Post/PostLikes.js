import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import style from './styles/Post.module.scss';
import { useLazyQuery } from '@apollo/react-hooks';
import { SEE_LIKES } from './PostQueries';
import Dialog from '../Dialog/Dialog';
import UserCard from '../UserCard';
import UserCardSkeleton from '../UserCard/UserCardSkeleton';

const PostLikes = ({ postId, likeCount, itsMe }) => {
  const { t } = useTranslation();
  const [likes, setLikes] = useState(null);
  const [show, setShow] = useState(false);

  const [seeLikes, { data, loading }] = useLazyQuery(SEE_LIKES, {
    variables: {
      postId
    },
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    if (data) {
      const { seeLikesPost } = data;
      setLikes(seeLikesPost);
    }
  }, [data]);

  const handleShowLikes = () => {
    seeLikes();
    setShow(true);
  };

  return (
    <section className={style.Likes}>
      { !!likeCount &&
      <div className={style.LikesRow}>
        <button type="button" onClick={handleShowLikes}>
          <span>{ likeCount } { t('Likes') }</span>
        </button>
      </div>
      }
      <Dialog
        show={show}
        title={t('Likes')}
        fullScreen
        withScrollingData
        onClose={() => setShow(false)}
      >
        { likes && likes.map(user => {
          const { username, avatar, fullName, isFollowing, id } = user;
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
        { loading &&
        <React.Fragment>
          { [...Array(6).keys()].map(idx => <UserCardSkeleton small key={idx} />) }
        </React.Fragment>
        }
      </Dialog>
    </section>
  )
};

PostLikes.propTypes = {
  postId: PropTypes.string.isRequired,
  likeCount: PropTypes.number.isRequired,
  itsMe: PropTypes.bool
};

export default PostLikes;

