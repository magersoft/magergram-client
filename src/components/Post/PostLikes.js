import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import style from './styles/Post.module.scss';

const PostLikes = ({ likeCount }) => {
  const { t } = useTranslation();

  return (
    <section className={style.Likes}>
      { !!likeCount &&
      <div className={style.LikesRow}>
        <button type="button">
          <span>{ likeCount } { t('Likes') }</span>
        </button>
      </div>
      }
    </section>
  )
};

PostLikes.propTypes = {
  likeCount: PropTypes.number.isRequired
};

export default PostLikes;

