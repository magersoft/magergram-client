import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Loader/Spinner';
import style from './styles/Post.module.scss';
import { useMutation } from '@apollo/react-hooks';
import { ADD_COMMENT } from './PostQueries';
import { useTranslation } from 'react-i18next';

const PostAddComment = ({ postId, comments, commentCount, userAnswer, setCountComment }) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [addComment, { loading: loadingAddComment }] = useMutation(ADD_COMMENT);

  const handleAddComment = event => {
    event.preventDefault();
    addComment({
      variables: {
        postId,
        text: comment
      },
      update: (cache, result) => {
        const { data: { addComment } } = result;
        if (addComment) {
          comments.push(addComment);
          if (setCountComment) {
            setCountComment(commentCount + 1);
          }
          setComment('');
        }
      }
    })
  };

  useEffect(() => {
    setComment(userAnswer);
  }, [userAnswer]);

  return (
    <section className={style.AddComment}>
      <div>
        <form className={style.CommentForm} method="post" onSubmit={handleAddComment}>
          <textarea
            aria-label={t('Add comment')}
            placeholder={`${t('Add comment')} ...`}
            autoComplete="off"
            autoCorrect="off"
            className={style.Textarea}
            value={comment}
            onChange={event => setComment(event.target.value)}
          />
          <button type="submit" disabled={!comment || loadingAddComment} className={style.SubmitComment}>
            { t('Publish') }
          </button>
          { loadingAddComment &&
          <div className={style.CommentLoading}>
            <Spinner />
          </div>
          }
        </form>
      </div>
    </section>
  )
};

PostAddComment.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  commentCount: PropTypes.number.isRequired,
  userAnswer: PropTypes.string,
  setCountComment: PropTypes.func
};

export default PostAddComment;
