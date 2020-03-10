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
import { useQuery } from '@apollo/react-hooks';
import { POST } from './PostQuery';
import style from './Post.module.scss';

export default ({ match, history }) => {
  const [post, setPost] = useState(null);
  const [answer, setAnswer] = useState('');

  const { data } = useQuery(POST, {
    variables: {
      id: match.params.postId
    }
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
  }, [data, post]);

  const setCountComment = count => {
    setPost({ ...post, [post.commentCount]: count })
  };

  const handleAnswerClick = username => {
    setAnswer(username);
  };

  return (
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
              />
              <PostButtons
                postId={post.id}
                isLiked={post.isLiked}
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
  )
};
