import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import NoAvatarImg from '../../assets/noAvatar.jpg';
import style from './styles/Post.module.scss';
import { Image } from '../UI';

const PostHeader =  ({ username, avatar, location, className }) => (
  <header className={style.Header + ' ' + className}>
    <div className={style.Avatar}>
      <Link to={`/${username}`} className={style.LinkToUser}>
        <Image src={avatar || NoAvatarImg} alt={`Avatar profile ${username}`} className={style.AvatarImg} />
      </Link>
    </div>
    <div className={style.UserInfo}>
      <div className={style.Username}>
        <div className={style.UsernameWrap}>
          <Link to={`/${username}`} className={style.UsernameLink}>{ username }</Link>
        </div>
      </div>
      <div className={style.Location}>
        <div>
          { location && <Link to="/" className={style.LocationLink}>{ location }</Link> }
        </div>
      </div>
    </div>
  </header>
);

PostHeader.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  location: PropTypes.string
};

export default PostHeader;
