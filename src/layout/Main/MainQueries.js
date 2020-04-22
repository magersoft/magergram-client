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
