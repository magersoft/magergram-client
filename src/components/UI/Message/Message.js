import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import style from './Message.module.scss'
import NoAvatarImg from '../../../assets/noAvatar.jpg';
import cx from 'classnames';
import emojiRegex from 'emoji-regex';

const Message = ({ id, text, fromUser, toUser, currentUserId }) => {

  const verifyMessage = () => {
    const regexEmoji = emojiRegex();
    let match;
    let onlyEmoji;
    // eslint-disable-next-line
    while (match = regexEmoji.exec(text)) {
      // todo not working
      onlyEmoji = match['index'] === 0 && match['input'].length === 1;
    }
    return (
      <div className={cx(style.MessageInner, onlyEmoji && style.Emoji)}>
        <div className={style.MessageText}>
          <span>{ text }</span>
        </div>
      </div>
    )
  }

  return (
    <div id={`msg-${id}`} className={cx(style.Message, fromUser.id === currentUserId && style.Mine)}>
      { fromUser.id !== currentUserId &&
      <div className={style.PartnerAvatar}>
        <Link to={`/${fromUser.username}`} className={style.Avatar}>
          <img src={fromUser.avatar || NoAvatarImg} alt={fromUser.username} />
        </Link>
      </div>
      }
      <div className={style.MessageWrapper}>
        { verifyMessage() }
      </div>
    </div>
  )
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  fromUser: PropTypes.object.isRequired,
  toUser: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired
};

export default Message;
