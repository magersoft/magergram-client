import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import style from '../Direct.module.scss';
import { NEW_MESSAGE_SUBSCRIPTION, READ_ROOM_MESSAGES, SEE_MESSAGES, SEE_ROOM, SEND_MESSAGE } from '../DirectQueries';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import AppHeader from '../../../components/AppHeader';
import BackIcon from '../../../components/Icon/BackIcon';
import Spinner from '../../../components/Loader/Spinner';
import { Loader } from '../../../components/Loader';
import { Button, Message } from '../../../components/UI';
import InfiniteScroll from 'react-infinite-scroller';
import { upperFirst } from 'lodash';
import { MY_PROFILE } from '../../../layout/Main/MainQueries';
import timeAgo from '../../../utils/timeAgo';

const PER_PAGE_MESSAGES = 10;

export default ({ match, history }) => {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [companionUser, setCompanionUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [text, setText] = useState('');
  const [itScrollingBottom, setItScrollingBottom] = useState(false);

  const messagesEndRef = useRef(null);

  const [readRoomMessages] = useMutation(READ_ROOM_MESSAGES);
  const [sendMessage, { loading: sendMessageLoading }] = useMutation(SEND_MESSAGE);

  useEffect(() => {
    if (!match.params.id) {
      history.push('/direct/inbox');
    }
  }, [match, history]);

  const { data, loading } = useQuery(SEE_ROOM, {
    variables: {
      id: match.params.id
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (data) {
      const { seeRoom } = data;
      if (seeRoom) {
        const [participant1, participant2] = seeRoom.participants;
        if (participant1.isSelf) {
          setCurrentUser(participant1);
          setCompanionUser(participant2);
        } else if (participant2.isSelf) {
          setCurrentUser(participant2);
          setCompanionUser(participant1);
        }
      }
    }
  }, [data]);

  const { data: messagesData, loading: messagesLoading, subscribeToMore, fetchMore } = useQuery(SEE_MESSAGES, {
    variables: {
      roomId: match.params.id,
      perPage: PER_PAGE_MESSAGES,
      page: 0
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      const { seeMessages } = data;
      if (seeMessages) {
        subscribeToMore({
          document: NEW_MESSAGE_SUBSCRIPTION,
          variables: { roomId: match.params.id },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }
            setTimeout(() => {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            });
            return Object.assign({}, prev, {
              seeMessages: [...prev.seeMessages, subscriptionData.data.newMessage]
            });
          }
        });

        readRoomMessages({
          variables: {
            roomId: match.params.id
          },
          refetchQueries: [{ query: MY_PROFILE }]
        })
      }
    }
  });

  useEffect(() => {
    if (messagesData) {
      const { seeMessages } = messagesData;
      if (messagesData) {
        setMessages(seeMessages);
      }
    }
  }, [messagesData]);

  const handleFetchMore = page => {
    try {
      fetchMore({
        variables: {
          page
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevResult;
          }
          if (!fetchMoreResult.seeMessages.length) {
            setNoMoreMessages(true);
          }
          const lastMoreMessage = fetchMoreResult.seeMessages[PER_PAGE_MESSAGES - 1];

          setTimeout(() => {
            if (lastMoreMessage) {
              const msgEl = document.getElementById(`msg-${lastMoreMessage.id}`);
              if (msgEl) {
                msgEl.scrollIntoView();
              }
            }
          });

          return {
            seeMessages: fetchMoreResult.seeMessages
              .filter(a => !prevResult.seeMessages.find(b => b.id === a.id))
              .concat(prevResult.seeMessages)
          }
        }
      })
    } catch {}
  }

  const handleSendMessage = event => {
    event.preventDefault();

    if (sendMessageLoading) return;

    if (text) {
      sendMessage({
        variables: {
          message: text,
          roomId: match.params.id,
          toId: companionUser.id
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
    if (itScrollingBottom) return;
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
      setItScrollingBottom(true);
    }
  }
  useEffect(scrollToBottom);

  return (
    <React.Fragment>
      { loading && <Loader showProgress /> }
      { currentUser && companionUser &&
      <React.Fragment>
        <Helmet>
          <title>{ companionUser.username } • Direct</title>
        </Helmet>
        <AppHeader
          customTitle={
            <div className={style.Header}>
              <Link to={`/${companionUser.username}`}>
                <div className={style.Avatar}>
                  <img src={companionUser.avatar} alt={companionUser.username} />
                </div>
              </Link>
              <Link to={`/${companionUser.username}`}>
                <h1 className={style.Username}>{ companionUser.username }</h1>
              </Link>
              <span className={style.lastOnline}>{ t('was') } { timeAgo.format(new Date(companionUser.latestOnline)) }</span>
            </div>
          }
          leftButton={
            <button className="back-button" onClick={history.goBack}>
              <BackIcon width={24} height={24} color="var(--color-main)" />
            </button>
          }
        />
        <div className={style.Room}>
          <InfiniteScroll
            pageStart={0}
            loadMore={handleFetchMore}
            hasMore={!noMoreMessages}
            isReverse
            initialLoad={false}
            className={style.Messages}
            loader={
              messages.length >= PER_PAGE_MESSAGES ?
              <div className={style.InitialLoading} key={0}>
                <Spinner width={40} height={40} />
              </div> : null
            }
          >
            { messages.length ?
              messages.map(message => {
                const { id, text, from, to, createdAt } = message;

                return (
                <React.Fragment key={id}>
                  <div className={style.MessageTime}>
                    <div className={style.MessageTimeWrapper}>
                      <div className={style.MessageTimeText}>
                        { upperFirst(new Date(createdAt).toLocaleTimeString('ru-ru', {
                          weekday: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })) }
                      </div>
                    </div>
                  </div>
                  <Message
                    id={id}
                    text={text}
                    fromUser={from}
                    toUser={to}
                    currentUserId={currentUser.id}
                  />
                </React.Fragment>
                )
              }) : null
            }
          </InfiniteScroll>
        </div>
        <div className={style.iOS11fix} />
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
        <div ref={messagesEndRef} className={style.End} />
      </React.Fragment>
      }
    </React.Fragment>
  )
};
