import { gql } from 'apollo-boost';

export const TOGGLE_LIKE = gql`
  mutation toggleLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($text: String!, $postId: String!) {
    addComment(text: $text, postId: $postId) {
      id
      text
      user {
        id
        username
        avatar
        isSelf
      }
      createdAt
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($id: String!) {
    removeComment(id: $id)
  }
`;

export const REMOVE_POST = gql`
  mutation removePost($id: String!) {
    removePost(id: $id)
  }
`;

export const SEE_LIKES = gql`
  query seeLikesPost($postId: String!) {
    seeLikesPost(postId: $postId) {
      id
      username
      avatar
      fullName
      isFollowing
      isSelf
      isPrivate
      isRequestingSubscription
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation addFavorite($postId: String!) {
    addFavorite(postId: $postId)
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation removeFavorite($postId: String!) {
    removeFavorite(postId: $postId)
  }
`;
