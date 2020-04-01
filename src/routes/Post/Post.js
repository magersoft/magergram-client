import React, { useEffect, useRef, useState } from 'react';
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
import { POST, POSTS_USER_MORE } from './PostQuery';
import style from './Post.module.scss';
import Dialog from '../../components/Dialog/Dialog';
import DialogButton from '../../components/Dialog/DialogButton';
import { useTranslation } from 'react-i18next';
import { REMOVE_COMMENT } from '../../components/Post/PostQueries';
import { MY_PROFILE } from '../../components/Header/HeaderQueries';
import InfiniteScroll from 'react-infinite-scroller';
import Spinner from '../../components/Loader/Spinner';
import PostCard from '../../components/PostCard';
import EmptyPosts from '../../components/EmptyPosts';
import { Link } from 'react-router-dom';

const PER_PAGE_POSTS = 3;

export default ({ match, history }) => {
  const { t } = useTranslation();
  const [post, setPost] = useState(null);
  const [morePosts, setMorePosts] = useState(null);
  const [noMorePosts, setNoMorePosts] = useState(false);
  const [answer, setAnswer] = useState('');
  const [dialog, setDialog] = useState({
    show: false,
    commentId: null,
    userId: null,
    commentUserId: null
  });
  const [itsMe, setItsMe] = useState(false);

  const postButtonsRef = useRef();

  const { data, client } = useQuery(POST, {
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

  useEffect(() => {
    if (post) {
      const { myProfile } = client.cache.readQuery({ query: MY_PROFILE });
      setItsMe(post.user.id === myProfile.id);
    }
  }, [post, client]);

  const [removeComment, { loading: removingCommentLoading }] = useMutation(REMOVE_COMMENT);

  const { data: dataMorePosts, loading: loadingMorePosts, fetchMore } = useQuery(POSTS_USER_MORE, {
    skip: !post,
    variables: {
      id: post ? post.id : null,
      username: post ? post.user.username : null,
      perPage: PER_PAGE_POSTS,
      page: 0
    }
  });

  useEffect(() => {
    if (dataMorePosts) {
      const { seePostsUserMore } = dataMorePosts;
      if (seePostsUserMore) {
        setMorePosts(seePostsUserMore);
      }
    }
  }, [dataMorePosts]);

  const handleFetchMore = async page => {
    fetchMore({
      skip: post,
      variables: {
        id: post.id,
        username: post.user.username,
        perPage: PER_PAGE_POSTS,
        page
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prevResult;
        }
        if (!fetchMoreResult.seePostsUserMore.length) {
          setNoMorePosts(true);
        }
        return {
          ...prevResult,
          seePostsUserMore: [ ...prevResult.seePostsUserMore, ...fetchMoreResult.seePostsUserMore ]
        }
      }
    })
  };

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
                  isLiked={post.isLiked}
                  postButtonsRef={postButtonsRef}
                />
              </div>
              <div className={style.Additional}>
                <PostCommentsBlock
                  postId={post.id}
                  itsMe={itsMe}
                  user={post.user}
                  caption={post.caption}
                  comments={post.comments}
                  answerClick={handleAnswerClick}
                  showDialog={handleShowDialog}
                  className={style.Comments}
                />
                <PostButtons
                  ref={postButtonsRef}
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
                  isSinglePost
                />
              </div>
              <PostTools postId={post.id} itsMe={itsMe} />
            </article>
          }
        </div>
        { morePosts && !loadingMorePosts ?
          <article className={style.Posts}>
            <div className={style.MorePosts}>
              { post && morePosts.length ?
              <span>Еще публикации от
                <Link to={`/${post.user.username}`}>{ post.user.username }</Link>
              </span> : null
              }
            </div>
            <InfiniteScroll
              pageStart={0}
              loadMore={handleFetchMore}
              hasMore={!noMorePosts}
              className={style.Grid}
              loader={
                <div key={0} className={style.MoreLoading}>
                  <Spinner width={50} height={50} />
                </div>
              }
            >
              { morePosts.map(post => {
                const { id, caption, likeCount, commentCount, files } = post;
                return <PostCard
                  id={id}
                  caption={caption}
                  files={files}
                  likeCount={likeCount}
                  commentCount={commentCount}
                  key={id}
                />
              }) }
            </InfiniteScroll>
          </article> :
          <article className={style.Posts}>
            <div className={style.Grid}>
              <div key={0} className={style.MoreLoading}>
                <Spinner width={50} height={50} />
              </div>
            </div>
          </article>
        }
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
