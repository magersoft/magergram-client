import { gql } from 'apollo-boost';

export const POST = gql`
  query seeFullPost($id: String!) {
    seeFullPost(id: $id) {
      id
      location
      caption
      likeCount
      isLiked
      isFavorite
      commentCount
      files {
        id
        url
      }
      user {
        id
        avatar
        username
        isSelf
      }
      comments {
        id
        text
        user {
          id
          username
          avatar
        }
        createdAt
      }
      createdAt
    }
  }
`;

export const POSTS_USER_MORE = gql`
  query seePostsUserMore($id: String!, $username: String!, $perPage: Int!, $page: Int!) {
    seePostsUserMore(id: $id, username: $username, perPage: $perPage, page: $page) {
      id
      caption
      likeCount
      commentCount
      files {
        id
        url
      }
    }
  }
`;
