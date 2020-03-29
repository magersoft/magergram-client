import { gql } from 'apollo-boost';

export const SEARCH_USERS = gql`
  query searchUsers($term: String!) {
    searchUsers(term: $term) {
      id
      avatar
      username
      fullName
    }
  }
`;

export const SEARCH_POSTS = gql`
  query searchPosts($term: String!) {
    searchPosts(term: $term) {
      id
      caption
      user {
        username
      }
    }
  }
`;
