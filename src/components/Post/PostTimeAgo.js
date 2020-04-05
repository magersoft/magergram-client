import React from 'react';
import PropTypes from 'prop-types';
import timeAgo from '../../utils/timeAgo';
import style from './styles/Post.module.scss';

const PostTimeAgo = ({ createdAt, className }) => (
  <div className={`${style.TimeAgo}  ${className}`}>
    <time dateTime={createdAt}>{ timeAgo.format(new Date(createdAt)) }</time>
  </div>
);

PostTimeAgo.propTypes = {
  createdAt: PropTypes.string.isRequired
};

PostTimeAgo.defaultProps = {
  className: ''
};

export default PostTimeAgo;
