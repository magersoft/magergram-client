import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import style from '../Direct.module.scss';
import { NEW_MESSAGE_SUBSCRIPTION, SEE_ROOM, SEND_MESSAGE } from '../DirectQueries';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../../components/AppHeader';
import BackIcon from '../../../components/Icon/BackIcon';
import cx from 'classnames';
import Spinner from '../../../components/Loader/Spinner';
import { Loader } from '../../../components/Loader';
import { Button } from '../../../components/UI';

export default ({ match, history }) => {
  const { t } = useTranslation();
  const [me, setMe] = useState(null);
  const [he, setHe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!match.params.id) {
      history.push('/direct/inbox');
    }
  }, [match, history]);

  const { data, loading, subscribeToMore } = useQuery(SEE_ROOM, {
    variables: {
      id: match.params.id
    },
    fetchPolicy: 'network-only',
    onCompleted: data => {
      const { seeRoom } = data;
      if (seeRoom) {
        subscribeToMore({
          document: NEW_MESSAGE_SUBSCRIPTION,
          variables: { roomId: match.params.id },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            return Object.assign({}, prev, {
              seeRoom: {
                ...prev.seeRoom,
                messages: [...prev.seeRoom.messages, subscriptionData.data.newMessage]
              }
            })
          }
        })
      }
    }
  });

  useEffect(() => {
    if (data) {
      const { seeRoom } = data;
      if (seeRoom) {
        const [user1, user2] = seeRoom.participants;
        setMe(user1);
        setHe(user2);
        setMessages(seeRoom.messages);
      }
    }
  }, [data]);

  const [sendMessage, { loading: sendMessageLoading }] = useMutation(SEND_MESSAGE);

  const handleSendMessage = event => {
    event.preventDefault();

    if (sendMessageLoading) return;

    if (text) {
      sendMessage({
        variables: {
          message: text,
          roomId: match.params.id,
          toId: he.id
        },
        update: (_, result) => {
          const { data: { sendMessage } } = result;
          if (sendMessage) {
            setText('');
          }
        }
      })
    }
  }

  const handleKeyboardPress = event => {
    if (sendMessageLoading) return;
    if (event.keyCode === 13) {
      handleSendMessage(event);
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }
  useEffect(scrollToBottom);

  return (
    <React.Fragment>
      { loading && <Loader showProgress /> }
      { me && he &&
      <React.Fragment>
        <Helmet>
          <title>{ he.username } • Direct</title>
        </Helmet>
        <AppHeader
          customTitle={
            <div className={style.Header}>
              <div className={style.Avatar}>
                <img src={he.avatar} alt={he.username} />
              </div>
              <h1 className={style.Username}>{ he.username }</h1>
            </div>
          }
          leftButton={
            <button className="back-button" onClick={history.goBack}>
              <BackIcon width={24} height={24} color="var(--color-main)" />
            </button>
          }
        />
        <div className={style.Messages}>
          { loading &&
          <div className={style.InitialLoading}>
            <Spinner width={40} height={40} />
          </div>
          }
          { messages.length ?
            messages.map(message => {
              const { id, text, from, to, createdAt } = message;

              return (
              <React.Fragment key={id}>
                <div className={cx(style.Message, from.isSelf && style.Mine)}>
                  <div className={style.MessageWrapper}>
                    <div className={style.MessageInner}>
                      <div className={style.MessageText}>
                        <span>{ text }</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={style.MessageTime}>
                  <div className={style.MessageTimeWrapper}>
                  <div className={style.MessageTimeText}>
                    { new Date(createdAt).toLocaleTimeString() }
                  </div>
                </div>
                </div>
              </React.Fragment>
              )
            }) : null
          }
            <div ref={messagesEndRef} />
        </div>
        <form className={style.SendMessage} onSubmit={handleSendMessage}>
          <div className={style.Control}>
            <div className={style.ControlWrapper}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyboardPress}
                placeholder={`${t('Enter message')} ...`}
              />
            </div>
            <div className={style.SendButton}>
              { sendMessageLoading
                ? <Spinner width={25} height={25} fill="var(--color-accent)" />
                : <Button label={t('Send')} disabled={sendMessageLoading} small />
              }
            </div>
          </div>
        </form>
      </React.Fragment>
      }
    </React.Fragment>
  )
};
