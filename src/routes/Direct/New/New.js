import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import AppHeader from '../../../components/AppHeader';
import BackIcon from '../../../components/Icon/BackIcon';
import { useTranslation } from 'react-i18next';
import style from '../Direct.module.scss';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { CREATE_ROOM, MY_FOLLOWING } from '../DirectQueries';
import UserCard from '../../../components/UserCard';
import { Button } from '../../../components/UI';
import UserCardSkeleton from '../../../components/UserCard/UserCardSkeleton';

export default ({ history }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const { data, loading } = useQuery(MY_FOLLOWING, { fetchPolicy: 'cache-and-network' });

  const [createRoom, { loading: loadingCreatingRoom }] = useMutation(CREATE_ROOM);

  useEffect(() => {
    if (data) {
      const { seeUsersForMessage } = data;
      setUsers(seeUsersForMessage);
    }
  }, [data]);

  const handleCreateRoom = userId => {
    createRoom({
      variables: {
        toId: userId
      },
      update: (_, result) => {
        const { data: { createRoomMessages } } = result;
        if (createRoomMessages) {
          history.push(`/direct/t/${createRoomMessages.id}`);
        }
      }
    })
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{ t('New message') } • Direct</title>
      </Helmet>
      <AppHeader
        title={t('New message')}
        leftButton={
          <button className="back-button" onClick={users.length ? history.goBack : () => history.push('/')}>
            <BackIcon width={24} height={24} color="var(--color-main)" />
          </button>
        }
      />
      <div className="container">
        <div className={style.Search}>
          <div className={style.To}>
            <h4>{ t('To') }:</h4>
          </div>
        </div>
        <div className={style.FollowingUsers}>
          <h2>{ t('Recommended') }</h2>
          { loading && [...Array(15).keys()].map(idx => <UserCardSkeleton key={idx} />) }
          { users.length ? users.map(user => {
            const { username, id, avatar, fullName } = user;
            return (
              <UserCard
                id={id}
                key={id}
                username={username}
                avatar={avatar}
                fullName={fullName}
                customButton={
                  <Button
                    label={t('Create room')}
                    disabled={loadingCreatingRoom}
                    onClick={() => handleCreateRoom(id)}
                  />
                }
              />
            )
          }) : <div className={style.EmptyParents}>{ t('Subscribe to start chatting') }</div> }
        </div>
      </div>
    </React.Fragment>
  )
}
