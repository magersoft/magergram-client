import React from 'react';
import PropTypes from 'prop-types';
import style from './styles/PostComment.module.scss';
import { Link } from 'react-router-dom';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import { useTranslation } from 'react-i18next';
import timeAgo from '../../utils/timeAgo';
import { ToolsIcon } from '../Icon';

const PostComment = ({ id, user, text, createdAt, answerClick, showDialog }) => {
  const { t } = useTranslation();

  const handleClickAnswer = () => {
    answerClick(`@${user.username}`);
  };

  const handleShowDialog = commentId => {
    showDialog(commentId);
  };

  return (
    <ul className={style.Container}>
      <div role="button">
        <li className={style.Comment} role="menuitem">
          <div className={style.Content}>
            <div className={style.User}>
              <span className={style.UserImg}>
                <Link to={`/${user.username}`}>
                  <img src={user.avatar || NoAvatarImg} alt={`User profile ${user.username}`} />
                </Link>
              </span>
            </div>
            <div className={style.Text}>
              <h3>
                <div className={style.Username}>
                  <Link to={`/${user.username}`}>{ user.username }</Link>
                </div>
              </h3>
              <span>
                { text }
              </span>
              <div className={style.Additional}>
              <div className={style.AnswerBlock}>
                <span>{ timeAgo.format(new Date(createdAt)) }</span>
                <button className={style.AnswerButton} onClick={handleClickAnswer}>{ t('Answer') }</button>
              </div>
            </div>
            </div>
          </div>
          <div className={style.Actions}>
            <button className={style.MoreButton} onClick={() => handleShowDialog(id)}>
              <ToolsIcon width="16" height="16" color="var(--darkGrayColor)" />
            </button>
          </div>
        </li>
      </div>
    </ul>
  )
};

PostComment.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  answerClick: PropTypes.func,
  showDialog: PropTypes.func
};

export default PostComment;

