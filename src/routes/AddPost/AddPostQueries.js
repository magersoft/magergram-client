import { gql } from 'apollo-boost';

export const ADD_POST = gql`
  mutation addPost($caption: String, $location: String, $files: [String!]!) {
    addPost(caption: $caption, location: $location, files: $files) {
      id
    }
  }
`;
