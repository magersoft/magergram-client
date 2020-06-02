import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import style from './styles/PostCommentsBlock.module.scss';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Link } from 'react-router-dom';
import { PostComment, PostTools } from './index';
import { Image } from '../UI';
import cx from 'classnames';
import { useMutation } from '@apollo/react-hooks';
import { EDIT_POST } from './PostQueries';

const PostCommentsBlock = ({
   postId,
   itsMe,
   user,
   caption,
   comments,
   answerClick,
   showDialog,
   editable,
   setEditable,
   setShowToast,
   className
}) => {
  const postCaptionRef = useRef();

  const [editPost] = useMutation(EDIT_POST);

  const handleChangePostCaption = () => {
    setEditable(true);
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

  return (
    <div className={`${style.Comments} ${className}`}>
      <ul className={style.CommentsList}>
        <div role="button" className={style.CaptionBlock}>
          <li role="menuitem" className={style.Caption}>
            <div className={style.CaptionWrapper}>
              <div role="button" className={style.CaptionUser} tabIndex="0">
              <span className={style.CaptionAvatar}>
                <Link to={`/${user.username}`}>
                  <Image src={user.avatar || NoAvatarImg} alt={`User profile ${user.username}`} />
                </Link>
              </span>
              </div>
              <div className={style.CaptionText}>
                <h2>
                  <div className={style.CaptionUsername}>
                    <Link to={`/${user.username}`}>{ user.username }</Link>
                  </div>
                </h2>
                <span
                  ref={postCaptionRef}
                  suppressContentEditableWarning={true}
                  contentEditable={editable}
                  className={cx(editable && style.Editable)}
                  onKeyDown={handleEditableContentKeydown}
                >
                  { caption }
                </span>
              </div>
              <PostTools
                postId={postId}
                itsMe={itsMe}
                onChangePostCaption={handleChangePostCaption}
                className={style.MobileTools}
              />
            </div>
          </li>
        </div>
        { comments.map(comment => (
          <PostComment
            key={comment.id}
            id={comment.id}
            user={comment.user}
            text={comment.text}
            createdAt={comment.createdAt}
            answerClick={answerClick}
            showDialog={showDialog}
          />
        )) }
      </ul>
    </div>
  )
};

PostCommentsBlock.propTypes = {
  postId: PropTypes.string,
  itsMe: PropTypes.bool,
  user: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  answerClick: PropTypes.func,
  showDialog: PropTypes.func,
  className: PropTypes.string
};

export default PostCommentsBlock;
