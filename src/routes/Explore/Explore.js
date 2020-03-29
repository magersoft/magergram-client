import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { SEE_EXPLORE } from './ExploreQuery';
import style from './Explore.module.scss';
import PostCard from '../../components/PostCard';
import { useTranslation } from 'react-i18next';
import SkeletonBlock from '../../components/Skeleton/SkeletonBlock/SkeletonBlock';
import EmptyPosts from '../../components/EmptyPosts';

export default () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);

  const { data, loading } = useQuery(SEE_EXPLORE, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (data) {
      const { seeExplore } = data;
      if (seeExplore) {
        setPosts(seeExplore);
      }
    }
  }, [data]);

  return (
    <div className="container">
      <div className={style.Posts}>
        <h1 className={style.Title}>{ t('Interesting') }</h1>
          <div className={style.Grid}>
            { posts.length && !loading ?
              posts.map(post => {
                const {id, files, commentCount, likeCount, caption} = post;
                return <PostCard
                  files={files}
                  id={id}
                  commentCount={commentCount}
                  likeCount={likeCount}
                  caption={caption}
                  key={id}
                />
              }) : null
            }
            { loading && [...Array(12).keys()].map(idx => <SkeletonBlock maxHeight={293} maxWidth={293} key={idx}/>) }
          </div>
        { !posts.length && <EmptyPosts /> }
      </div>
    </div>
  )
};
