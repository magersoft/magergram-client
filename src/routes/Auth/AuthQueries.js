import { gql } from 'apollo-boost';

export const SIGN_IN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      error
    }
  }
`;
