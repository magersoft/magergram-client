import React, { useEffect, useState } from 'react';
import {
  PostAddComment,
  PostButtons,
  PostContent,
  PostHeader,
  PostLikes,
  PostTimeAgo,
  PostTools,
  PostCommentsBlock, PostSkeleton
} from '../../components/Post';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { POST } from './PostQuery';
import style from './Post.module.scss';
import Dialog from '../../components/Dialog/Dialog';
import DialogButton from '../../components/Dialog/DialogButton';
import { useTranslation } from 'react-i18next';
import { REMOVE_COMMENT } from '../../components/Post/PostQueries';

export default ({ match, history }) => {
  const { t } = useTranslation();
  const [post, setPost] = useState(null);
  const [answer, setAnswer] = useState('');
  const [dialog, setDialog] = useState({
    show: false,
    commentId: null,
    userId: null,
    commentUserId: null
  });

  const { data } = useQuery(POST, {
    variables: {
      id: match.params.postId
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!match.params.postId) {
      history.push('/')
    }
  }, [match, history]);

  useEffect(() => {
    if (data) {
      const { seeFullPost } = data;
      if (seeFullPost) {
        setPost(seeFullPost);
      }
    }
  }, [data]);

  const [removeComment, { loading: removingCommentLoading }] = useMutation(REMOVE_COMMENT);

  const handleLike = like => {
    const count = like ? post.likeCount - 1 : post.likeCount + 1;
    setPost({ ...post, likeCount: count });
  };

  const setCountComment = count => {
    setPost({ ...post, commentCount: count })
  };

  const handleAnswerClick = username => {
    setAnswer(username);
  };

  const handleShowDialog = (commentId, userId, commentUserId) => {
    setDialog({ commentId, userId, commentUserId, show: true });
  };

  const handleDeleteComment = () => {
    removeComment({
      variables: {
        id: dialog.commentId
      },
      update: (cache, result) => {
        const { data: { removeComment } } = result;
        if (removeComment) {
          setPost({
            ...post,
            comments: post.comments.filter(comment => comment.id !== removeComment)
          });
          setDialog({
            ...dialog,
            show: false
          });
        }
      }
    })
  };

  return (
    <React.Fragment>
      <div className="container">
        <div className={style.Post}>
          { !post ?
            <PostSkeleton />
            :
            <article className={style.Article}>
              <PostHeader
                username={post.user.username}
                avatar={post.user.avatar}
                className={style.Header}
              />
              <div className={style.Content}>
                <PostContent
                  files={post.files}
                />
              </div>
              <div className={style.Additional}>
                <PostCommentsBlock
                  user={post.user}
                  caption={post.caption}
                  comments={post.comments}
                  answerClick={handleAnswerClick}
                  showDialog={handleShowDialog}
                />
                <PostButtons
                  postId={post.id}
                  isLiked={post.isLiked}
                  className={style.Actions}
                  onLike={handleLike}
                />
                <PostLikes
                  likeCount={post.likeCount}
                />
                <PostTimeAgo
                  createdAt={post.createdAt}
                />
                <PostAddComment
                  comments={post.comments}
                  commentCount={post.commentCount}
                  postId={post.id}
                  userAnswer={answer}
                  setCountComment={setCountComment}
                />
              </div>
              <PostTools />
            </article>
          }
        </div>
      </div>
      <Dialog show={dialog.show}>
        { dialog.commentUserId === dialog.userId &&
          <DialogButton text={t('Delete')} type="danger" loading={removingCommentLoading} onClick={handleDeleteComment} />
        }
        <DialogButton text={t('Cancel')} onClick={() => setDialog({ ...dialog, show: false })} />
      </Dialog>
    </React.Fragment>
  )
};
