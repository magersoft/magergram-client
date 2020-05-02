import { gql } from 'apollo-boost';

export const MY_PROFILE = gql`
  query myProfile {
    myProfile {
      id
      avatar
      username
      fullName
      firstName
      lastName
      email
      phone
      website
      bio
      language
      darkMode
      isSelf
      isPrivate
      isRequestingSubscription
      newNotificationsCount
      newMessagesCount
      emailNotification
    }
  }
`;

export const LISTEN_MESSAGE = gql`
  subscription listenMessage($userId: String!) {
    listenMessage(userId: $userId) {
      id
      text
      from {
        id
        username
        avatar
      }
      to {
        id
        username
        avatar
      }
      room {
        id
      }
      createdAt
    }
  }
`;
