import React from 'react';
import PropTypes from 'prop-types';
import style from './styles/Post.module.scss';

const PostContent = ({ files, caption }) => (
  <div>
    <div className={style.Content}>
      <div className={style.ImageBlock}>
        <img src={files[0].url} alt={caption} className={style.Image}/>
      </div>
    </div>
  </div>
);

PostContent.propTypes = {
  files: PropTypes.array.isRequired,
  caption: PropTypes.string
};

export default PostContent;
