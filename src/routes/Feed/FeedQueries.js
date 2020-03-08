import { gql } from 'apollo-boost';

export const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      id
      location
      caption
      likeCount
      isLiked
      user {
        id
        avatar
        username
      }
      files {
        id
        url
      }
      comments {
        id
        text
        user {
          id
          username
        }
      }
      createdAt
    }
  }
`;
