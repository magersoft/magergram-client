import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { CommentIcon, FavoriteIcon, LikeIcon, RemoveFavoriteIcon, SharedIcon, UnlikeIcon } from '../Icon';
import { useMutation } from '@apollo/react-hooks';
import { ADD_FAVORITE, REMOVE_FAVORITE, TOGGLE_LIKE } from './PostQueries';
import { FEED_QUERY } from '../../routes/Feed/FeedQueries';
import style from './styles/Post.module.scss';
import { sharePublication } from './postShare';
import { useTranslation } from 'react-i18next';

const PostButtons = forwardRef(({ postId, isLiked, isFavorite, className = '', onLike }, ref) => {
  const { t } = useTranslation();
  const [like, setLiked] = useState(isLiked);
  const [favorite, setFavorite] = useState(isFavorite);

  const [toggleLike] = useMutation(TOGGLE_LIKE);
  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeFavorite] = useMutation(REMOVE_FAVORITE);

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

  const handleCommentClick = () => {
    history.push(`/post/${postId}`);
    const goToCommentForm = () => {
      const form = document.getElementById('add-comment');
      if (form) {
        const textarea = form.querySelector('textarea');
        if (textarea) {
          textarea.focus();
        }
        return true;
      }
      return false;
    };
    if (goToCommentForm()) {
      return true;
    }

    const interval = setInterval(() => {
        if (goToCommentForm()) {
          clearInterval(interval);
        }
    }, 500);
  };

  const handleSharedClick = () => sharePublication(postId, t);

  const handleFavoriteClick = () => {
    setFavorite(!favorite);
    if (!favorite) {
      addFavorite({
        variables: {
          postId
        }
      })
    } else {
      removeFavorite({
        variables: {
          postId
        }
      })
    }
  };

  useImperativeHandle(ref, () => ({
    toggleLike() {
      handleToggleLike();
    }
  }));

  return (
    <section className={`${style.Actions} ${className}`}>
      <span className={`${style.LikeButton} ${ like ? style.LikeButtonAnimationLike : style.LikeButtonAnimationUnLike }`}>
            <button type="button" className={style.ButtonIcon} onClick={handleToggleLike}>
              { like
                ? <UnlikeIcon width="24" height="24" color="var(--color-danger)" />
                : <LikeIcon width="24" height="24" color="var(--color-main)" />
              }
            </button>
          </span>
      <span className={style.CommentButton}>
        <button type="button" className={style.ButtonIcon} onClick={handleCommentClick}>
          <CommentIcon width="24" height="24" color="var(--color-main)" />
        </button>
      </span>
      <button type="button" className={style.ButtonIcon} onClick={handleSharedClick}>
        <SharedIcon width="24" height="24" color="var(--color-main)" />
      </button>
      <span className={style.FavoriteButton}>
        <button type="button" className={style.ButtonIcon} onClick={handleFavoriteClick}>
          { favorite
            ? <RemoveFavoriteIcon width="24" height="24" color="var(--color-main)" />
            : <FavoriteIcon width="24" height="24" color="var(--color-main)" />
          }
        </button>
      </span>
    </section>
  )
});

PostButtons.propTypes = {
  postId: PropTypes.string.isRequired,
  isLiked: PropTypes.bool.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onLike: PropTypes.func
};

export default PostButtons;
