import { gql } from 'apollo-boost';

export const POST = gql`
  query seeFullPost($id: String!) {
    seeFullPost(id: $id) {
      id
      location
      caption
      likeCount
      isLiked
      commentCount
      files {
        id
        url
      }
      user {
        id
        avatar
        username
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
