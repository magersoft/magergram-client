import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import BackIcon from '../../../components/Icon/BackIcon';
import { Link } from 'react-router-dom';
import { NewMessage } from '../../../components/Icon';
import AppHeader from '../../../components/AppHeader';
import style from '../Direct.module.scss';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { SEE_ROOMS } from '../DirectQueries';
import timeAgo from '../../../utils/timeAgo';
import cx from 'classnames';
import UserCardSkeleton from '../../../components/UserCard/UserCardSkeleton';
import SkeletonAvatar from '../../../components/Skeleton/SkeletonAvatar';
import SkeletonString from '../../../components/Skeleton/SkeletonString';

export default ({ history }) => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState([]);

  const { data, loading } = useQuery(SEE_ROOMS, {
    fetchPolicy: 'network-only',
    // pollInterval: 1000
  });

  useEffect(() => {
    if (data) {
      const { seeRooms } = data;
      setRooms(seeRooms);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{ t('Inbox') } • Direct</title>
      </Helmet>
      <AppHeader
        title={t('Direct')}
        leftButton={
          <button className="back-button" onClick={history.goBack}>
            <BackIcon width={24} height={24} color="var(--color-main)" />
          </button>
        }
        rightButton={
          <Link to={'/direct/new'}>
            <NewMessage width={24} height={24} color="var(--color-main)" />
          </Link>
        }
      />
      <div className="container">
        <div className={style.Inbox}>
          { rooms.length ? rooms.map(room => {
            const user = room.participants[1];
            const lastMessage = room.lastMessage[0];

            return (
              <div className={cx(style.RoomCard, !lastMessage.isRead && style.UnRead)} key={room.id}>
                <div className={style.Dot} />
                <Link to={`/direct/t/${room.id}`}>
                  <div className={style.RoomCardWrapper}>
                    <div className={style.Avatar}>
                      <img src={user.avatar} alt={user.username} />
                    </div>
                    <div className={style.RoomCardInfo}>
                      <div className={style.RoomCardUsername}>
                        { user.username }
                      </div>
                      <div className={style.RoomCardMessage}>
                        <span className={style.RoomCardMessageText}>{ lastMessage.text }</span>
                        <span>&nbsp;•&nbsp;</span>
                        <span>{ timeAgo.format(new Date(lastMessage.createdAt)) }</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          }) : null }
          { loading && [...Array(10).keys()].map(idx => (
            <div className={style.RoomCard} key={idx}>
              <div className={style.RoomCardWrapper}>
                <div className={style.Avatar}>
                  <SkeletonAvatar width={56} height={56} />
                </div>
                <div className={style.RoomCardInfo}>
                  <SkeletonString height={15} width={300} />
                </div>
              </div>
            </div>
          )) }
        </div>
      </div>
    </React.Fragment>
  )
}
