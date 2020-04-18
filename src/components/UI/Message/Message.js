import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import style from './Message.module.scss'
import cx from 'classnames';
import emojiRegex from 'emoji-regex';

const Message = ({ id, text, fromUser, toUser, currentUserId }) => {

  const verifyMessage = () => {
    const regexEmoji = emojiRegex();
    let match;
    let emoji;
    let onlyEmoji;
    while (match = regexEmoji.exec(text)) {
      emoji = match[0];
      onlyEmoji = match['index'] === 0;
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
          <img src={fromUser.avatar} alt={fromUser.username} />
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
