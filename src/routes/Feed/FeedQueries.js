import { gql } from 'apollo-boost';

export const FEED_QUERY = gql`
  query seeFeed($perPage: Int!, $page: Int!) {
    seeFeed(perPage: $perPage, page: $page) {
      id
      location
      caption
      likeCount
      isLiked
      isFavorite
      commentCount
      user {
        id
        avatar
        username
        isSelf
      }
      files {
        id
        url
      }
      lastComments {
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
