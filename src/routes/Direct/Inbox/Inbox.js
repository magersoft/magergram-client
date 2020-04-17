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

export default ({ history }) => {
  const { t } = useTranslation();

  const [rooms, setRooms] = useState([]);

  const { data, loading } = useQuery(SEE_ROOMS);

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
            return (
              <div className={style.RoomCard} key={room.id}>
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
                        <span>{ room.lastMessage[0].text }</span>
                        <span>&nbsp;•&nbsp;</span>
                        <span>{ timeAgo.format(new Date(room.lastMessage[0].createdAt)) }</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          }) : null }
        </div>
      </div>
    </React.Fragment>
  )
}
