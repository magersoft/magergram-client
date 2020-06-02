import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PostAddComment, PostButtons, PostContent, PostHeader, PostLikes, PostTimeAgo, PostTools } from './index';
import cx from 'classnames';
import style from './styles/Post.module.scss';
import Toast from '../Toast';
import { useMutation } from '@apollo/react-hooks';
import { EDIT_POST } from './PostQueries';

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
  isFavorite,
  createdAt
}) => {
  const { t } = useTranslation();
  const [countComment, setCountComment] = useState(commentCount);
  const [countLike, setCountLike] = useState(likeCount);
  const [editable, setEditable] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const postButtonsRef = useRef();
  const postCaptionRef = useRef();

  const [editPost] = useMutation(EDIT_POST);

  const handleLike = like => {
    const count = like ? countLike - 1 : countLike + 1;
    setCountLike(count);
  };

  const handleEditableContentKeydown = event => {
    if (!editable) {
      return false;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const text = postCaptionRef.current.textContent;
      if (text !== caption) {
        editPost({
          variables: {
            id: postId,
            caption: text
          },
          update: (_, result) => {
            const { data: { editPost } } = result;
            if (editPost.id === postId) {
              setEditable(false);
              setShowToast(true);
            }
          }
        })
      } else {
        setEditable(false);
      }
    }
  }

  const handleChangePostCaption = () => {
    setEditable(true);
  };

  return (
    <React.Fragment>
      <article className={style.Post}>
        <PostHeader
          username={user.username}
          avatar={user.avatar}
          location={location}
        />
        <PostContent
          files={files}
          caption={caption}
          isLiked={isLiked}
          postButtonsRef={postButtonsRef}
        />
        <div className={style.Additional}>
          <PostButtons
            ref={postButtonsRef}
            postId={postId}
            isLiked={isLiked}
            isFavorite={isFavorite}
            onLike={handleLike}
          />
          <PostLikes
            itsMe={user.isSelf}
            postId={postId}
            likeCount={countLike}
          />
          <div className={style.Caption}>
            <div className={style.CommentText}>
              <Link to={`/${user.username}`}>{ user.username }</Link>
              &nbsp;
              <span
                ref={postCaptionRef}
                suppressContentEditableWarning={true}
                contentEditable={editable}
                className={cx(editable && style.Editable)}
                onKeyDown={handleEditableContentKeydown}
              >{ caption }</span>
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
        <PostTools
          postId={postId}
          itsMe={user.isSelf}
          onChangePostCaption={handleChangePostCaption}
        />
      </article>
      <Toast show={showToast} duration={4000} message={t('Post changed')} />
    </React.Fragment>
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
  isFavorite: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired
};

export default Post;
