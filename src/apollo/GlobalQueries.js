import { gql } from 'apollo-boost';

export const LOG_USER_IN = gql`
  mutation logUserIn($token: String!) {
    logUserIn(token: $token) @client
  }
`;

export const LOG_USER_OUT = gql`
  mutation logUserOut {
    logUserOut @client
  }
`;

export const SET_LOADING = gql`
  mutation setLoading {
    setLoading @client
  }
`;

export const REMOVE_LOADING = gql`
  mutation removeLoading {
    removeLoading @client
  }
`;

export const UPLOAD_FILE = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      path
    }
  }
`;

export const DELETE_FILE = gql`
  mutation fileDelete($filename: String!) {
    fileDelete(filename: $filename)
  }
`;
