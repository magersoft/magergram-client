import { gql } from 'apollo-boost';

export const SEE_NOTIFICATIONS = gql`
  query seeNotifications {
    seeNotifications {
      id
      type
      requesting
      user {
        username
      }
      subscriber {
        id
        username
        avatar
      }
      post {
        id
        files {
          url
        }
      }
      createdAt
    }
  }
`;

export const CONFIRM_FOLLOW = gql`
  mutation confirmFollow($notificationId: String!, $requestUserId: String!) {
    confirmFollow(notificationId: $notificationId, requestUserId: $requestUserId) {
      id
    }
  }
`;
