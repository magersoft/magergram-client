import React from 'react';
import PropTypes from 'prop-types';
import style from './styles/PostCommentsBlock.module.scss';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { Link } from 'react-router-dom';
import { PostComment } from './index';

const PostCommentsBlock = ({ user, caption, comments, answerClick }) => {
  return (
    <div className={style.Comments}>
      <ul className={style.CommentsList}>
        <div role="button" className={style.CaptionBlock}>
          <li role="menuitem" className={style.Caption}>
            <div className={style.CaptionWrapper}>
              <div role="button" className={style.CaptionUser} tabIndex="0">
              <span className={style.CaptionAvatar}>
                <Link to={`/${user.username}`}>
                  <img src={user.avatar || NoAvatarImg} alt={`User profile ${user.username}`} />
                </Link>
              </span>
              </div>
              <div className={style.CaptionText}>
                <h2>
                  <div className={style.CaptionUsername}>
                    <Link to={`/${user.username}`}>{ user.username }</Link>
                  </div>
                </h2>
                <span>
                  { caption }
                </span>
              </div>
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
          />
        )) }
      </ul>
    </div>
  )
};

PostCommentsBlock.propTypes = {
  user: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  answerClick: PropTypes.func
};

export default PostCommentsBlock;
