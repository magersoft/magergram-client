import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CommentIcon, FavoriteIcon, LikeIcon, SharedIcon, UnlikeIcon } from '../Icon';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_LIKE } from './PostQueries';
import { FEED_QUERY } from '../../routes/Feed/FeedQueries';
import style from './styles/Post.module.scss';

const PostButtons = ({ postId, isLiked, className = '', onLike }) => {
  const [like, setLiked] = useState(isLiked);
  const [toggleLike] = useMutation(TOGGLE_LIKE);
  const history = useHistory();

  const handleToggleLike = () => {
    setLiked(!like);
    if (onLike) {
      onLike(like);
    }
    toggleLike({
      variables: {
        postId
      },
      update: (cache, result) => {
        const { data: { toggleLike } } = result;
        if (toggleLike) {
          try {
            const { seeFeed } = cache.readQuery({ query: FEED_QUERY });
            if (seeFeed) {
              const updated = seeFeed.map(post => {
                if (post.id === postId) {
                  post.isLiked = !like;
                  post.likeCount = like ? post.likeCount - 1 : post.likeCount + 1
                }
                return post;
              });
              cache.writeQuery({ query: FEED_QUERY, data: { seeFeed: updated } })
            }
          } catch {}
        }
      }
    });
  };

  return (
    <section className={`${style.Actions} ${className}`}>
      <span className={`${style.LikeButton} ${ like ? style.LikeButtonAnimationLike : style.LikeButtonAnimationUnLike }`}>
            <button type="button" className={style.ButtonIcon} onClick={handleToggleLike}>
              { like ?
                <UnlikeIcon width="24" height="24" color="var(--redColor)" /> :
                <LikeIcon width="24" height="24" color="var(--blackColor)" />
              }
            </button>
          </span>
      <span className={style.CommentButton}>
        <button type="button" className={style.ButtonIcon} onClick={() => history.push(`/post/${postId}`)}>
          <CommentIcon width="24" height="24" color="var(--blackColor)" />
        </button>
      </span>
      <button type="button" className={style.ButtonIcon}>
        <SharedIcon width="24" height="24" color="var(--blackColor)" />
      </button>
      <span className={style.FavoriteButton}>
        <button type="button" className={style.ButtonIcon}>
          <FavoriteIcon width="24" height="24" color="var(--blackColor)" />
        </button>
      </span>
    </section>
  )
};

PostButtons.propTypes = {
  postId: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onLike: PropTypes.func
};

export default PostButtons;
