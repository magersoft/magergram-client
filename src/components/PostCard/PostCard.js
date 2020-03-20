import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import style from './PostCard.module.scss';
import { Image } from '../UI';

const PostCard = ({ id, caption, likeCount, commentCount, files }) => {
  const [hover, setHover] = useState(false);

  const handleMouseOver = () => {
    setHover(true)
  };

  const handleOnMouseLeave = () => {
    setHover(false);
  };

  return (
    <div className={style.Post}>
      <div className={style.Container}>
        <Link to={`/post/${id}`} >
          <div className={style.Wrapper}>
            <div className={style.Image} onMouseOver={handleMouseOver}>
              <Image src={files[0].url} alt={caption || 'Without caption'} />
            </div>
            <div
              className={`${style.Block} ${ hover ? style.active : null }`}
              onMouseLeave={handleOnMouseLeave}
              onMouseOut={handleOnMouseLeave}
            >
              <div className={style.Icon}>
                <div className={`${style.IconHeart} sprite`} />
                <span>{ likeCount }</span>
              </div>
              <div className={style.Icon}>
                <div className={`${style.IconComment} sprite`} />
                <span>{ commentCount }</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
};

PostCard.propTypes = {
  id: PropTypes.string.isRequired,
  caption: PropTypes.string,
  likeCount: PropTypes.number,
  commentCount: PropTypes.number,
  files: PropTypes.array.isRequired
};

export default PostCard;
