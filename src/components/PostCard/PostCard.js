import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import style from './PostCard.module.scss';
import { Image } from '../UI';

const PostCard = ({ id, caption, files }) => {

  return (
    <div className={style.Post}>
      <div className={style.Container}>
        <Link to={`/post/${id}`} >
          <div className={style.Wrapper}>
            <div className={style.Image}>
              <Image src={files[0].url} alt={caption} />
            </div>
            <div className={style.Block} />
          </div>
        </Link>
      </div>
    </div>
  )
};

PostCard.propTypes = {
  id: PropTypes.string.isRequired,
  caption: PropTypes.string,
  files: PropTypes.array.isRequired
};

export default PostCard;
