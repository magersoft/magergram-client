import React from 'react';
import PropTypes from 'prop-types';
import timeAgo from '../../utils/timeAgo';
import style from './styles/Post.module.scss';

const PostTimeAgo = ({ createdAt }) => (
  <div className={style.TimeAgo}>
    <time dateTime={createdAt}>{ timeAgo.format(new Date(createdAt)) }</time>
  </div>
);

PostTimeAgo.propTypes = {
  createdAt: PropTypes.string.isRequired
};

export default PostTimeAgo;
