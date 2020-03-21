import { gql } from 'apollo-boost';

export const RECOMMEND_USERS = gql`
  query recommendedUsers {
    recommendedUsers {
      id
      username
      fullName
      avatar
      isFollowing
    }
  }
`;
