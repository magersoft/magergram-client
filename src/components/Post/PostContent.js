import React, { useState } from 'react';
import PropTypes from 'prop-types';
import style from './styles/Post.module.scss';
import { Image } from '../UI';

const PostContent = ({ files, caption, isLiked, postButtonsRef }) => {
  const [like, setLike] = useState(false);

  const handleToggleLike = () => {
    if (!isLiked) {
      postButtonsRef.current.toggleLike();
      setLike(!like);
    }
  };

  return (
    <div>
      <div className={style.Content}>
        <div className={style.ImageBlock} onDoubleClick={handleToggleLike}>
          <Image src={files[0].url} alt={caption} className={style.Image} />
          <div className={style.LikeShow}>
            <span className={`${style.LikeIcon} ${like ? style.LikeIconAnimationLike : null} sprite`} />
          </div>
        </div>
      </div>
    </div>
  )
};

PostContent.propTypes = {
  files: PropTypes.array.isRequired,
  caption: PropTypes.string,
  isLiked: PropTypes.bool,
  postButtonsRef: PropTypes.object
};

export default PostContent;
