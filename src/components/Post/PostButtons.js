import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CommentIcon, FavoriteIcon, LikeIcon, SharedIcon, UnlikeIcon } from '../Icon';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_LIKE } from './PostQueries';
import { FEED_QUERY } from '../../routes/Feed/FeedQueries';
import style from './Post.module.scss';

const PostButtons = ({ postId, isLiked }) => {
  const [like, setLiked] = useState(isLiked);
  const [toggleLike] = useMutation(TOGGLE_LIKE);

  const handleToggleLike = () => {
    setLiked(!like);
    toggleLike({
      variables: {
        postId
      },
      refetchQueries: [{ query: FEED_QUERY }]
    });
  };

  return (
    <section className={style.Actions}>
      <span className={`${style.LikeButton} ${ like ? style.LikeButtonAnimationLike : style.LikeButtonAnimationUnLike }`}>
            <button type="button" className={style.ButtonIcon} onClick={handleToggleLike}>
              { like ?
                <UnlikeIcon width="24" height="24" color="var(--redColor)" /> :
                <LikeIcon width="24" height="24" color="var(--blackColor)" />
              }
            </button>
          </span>
      <span className={style.CommentButton}>
        <button type="button" className={style.ButtonIcon}>
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
  isLiked: PropTypes.bool.isRequired
};

export default PostButtons;
