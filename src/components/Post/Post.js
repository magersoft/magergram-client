import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import style from './Post.module.scss';
import { CommentIcon, FavoriteIcon, LikeIcon, SharedIcon, UnlikeIcon } from '../Icon';
import { useMutation } from '@apollo/react-hooks';
import { ADD_COMMENT, TOGGLE_LIKE } from './PostQueries';
import { useTranslation } from 'react-i18next';
import { FEED_QUERY } from '../../routes/Feed/FeedQueries';
import Spinner from '../Loader/Spinner';

export default ({
  postId,
  user,
  location,
  caption,
  files,
  comments,
  likeCount,
  isLiked,
  createdAt
}) => {
  const { t } = useTranslation();
  const [like, setLiked] = useState(isLiked);
  const [comment, setComment] = useState('');

  const [toggleLike] = useMutation(TOGGLE_LIKE);
  const [addComment, { loading: loadingAddComment }] = useMutation(ADD_COMMENT);

  const handleToggleLike = () => {
    setLiked(!like);
    toggleLike({
      variables: {
        postId
      },
      refetchQueries: [{ query: FEED_QUERY }]
    });
  };

  const handleAddComment = event => {
    event.preventDefault();
    addComment({
      variables: {
        postId,
        text: comment
      },
      update: (_, result) => {
        const { data: { addComment } } = result;
        if (addComment) {
          comments.push(addComment);
          setComment('');
        }
      }
    })
  };

  return (
    <article className={style.Post}>
      <header className={style.Header}>
        <div className={style.Avatar}>
          <Link to={user.username} className={style.LinkToUser}>
            <img src={user.avatar ? user.avatar : NoAvatarImg} alt={`Avatar profile ${user.username}`} className={style.AvatarImg} />
          </Link>
        </div>
        <div className={style.UserInfo}>
          <div className={style.Username}>
            <div className={style.UsernameWrap}>
              <Link to={user.username} className={style.UsernameLink}>{ user.username }</Link>
            </div>
          </div>
          <div className={style.Location}>
            <div>
              { location && <Link to="/" className={style.LocationLink}>{ location }</Link> }
            </div>
          </div>
        </div>
      </header>
      <div>
        <div className={style.Content}>
          <div className={style.ImageBlock}>
            <img src={files[0].url} alt={caption} className={style.Image}/>
          </div>
        </div>
      </div>
      <div className={style.Additional}>
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
        <section className={style.Likes}>
          { !!likeCount &&
            <div className={style.LikesRow}>
              <button type="button">
                <span>{ likeCount } { t('Likes') }</span>
              </button>
            </div>
          }
        </section>
        <div className={style.Comments}>
          { !!comments.length &&
            <div>
              { comments.map(comment => (
                <div key={comment.id} className={style.Comment}>
                  <div className={style.CommentText}>
                    <Link to={comment.user.username}>{ comment.user.username }</Link>
                    &nbsp;
                    <span>{ comment.text }</span>
                  </div>
                </div>
              )) }
            </div>
          }
        </div>
        <div className={style.TimeAgo}>
          <time dateTime={createdAt}>{ createdAt }</time>
        </div>
        <section className={style.AddComment}>
          <div>
            <form className={style.CommentForm} method="post" onSubmit={handleAddComment}>
              <textarea
                aria-label={t('Add comment')}
                placeholder={`${t('Add comment')} ...`}
                autoComplete="off"
                autoCorrect="off"
                className={style.Textarea}
                value={comment}
                onChange={event => setComment(event.target.value)}
              />
              <button type="submit" disabled={!comment || loadingAddComment} className={style.SubmitComment}>
                { t('Publish') }
              </button>
              { loadingAddComment &&
                <div className={style.CommentLoading}>
                  <Spinner />
                </div>
              }
            </form>
          </div>
        </section>
      </div>
      <div className={style.Tools}>

      </div>
    </article>
  )
}
