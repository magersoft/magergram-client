import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PostAddComment, PostButtons, PostContent, PostHeader, PostLikes, PostTimeAgo, PostTools } from './index';
import style from './styles/Post.module.scss';

const Post = ({
  postId,
  user,
  location,
  caption,
  files,
  comments,
  commentCount,
  likeCount,
  isLiked,
  createdAt
}) => {
  const { t } = useTranslation();
  const [countComment, setCountComment] = useState(commentCount);
  const [countLike, setCountLike] = useState(likeCount);

  const handleLike = like => {
    const count = like ? countLike - 1 : countLike + 1;
    setCountLike(count);
  };

  return (
    <article className={style.Post}>
      <PostHeader
        username={user.username}
        avatar={user.avatar}
        location={location}
      />
      <PostContent
        files={files}
        caption={caption}
      />
      <div className={style.Additional}>
        <PostButtons
          postId={postId}
          isLiked={isLiked}
          onLike={handleLike}
        />
        <PostLikes
          likeCount={countLike}
        />
        <div className={style.Caption}>
          <div className={style.CommentText}>
            <Link to={`/${user.username}`}>{ user.username }</Link>
            &nbsp;
            <span>{ caption }</span>
          </div>
        </div>
        <div className={style.Comments}>
          { !!comments.length &&
            <React.Fragment>
              <div className={style.CommentsMore}>
                <Link to={`/post/${postId}`} >{ t('See all comments') } ({ countComment })</Link>
              </div>
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
            </React.Fragment>
          }
        </div>
        <PostTimeAgo
          createdAt={createdAt}
        />
        <PostAddComment
          postId={postId}
          comments={comments}
          commentCount={countComment}
          setCountComment={setCountComment}
          className={style.PostAddComment}
        />
      </div>
      <PostTools />
    </article>
  )
};

Post.propTypes = {
  postId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  location: PropTypes.string,
  caption: PropTypes.string,
  files: PropTypes.array.isRequired,
  comments: PropTypes.array,
  commentCount: PropTypes.number,
  likeCount: PropTypes.number,
  isLiked: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired
};

export default Post;
