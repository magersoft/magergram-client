import { gql } from 'apollo-boost';

export const SIGN_IN = gql`
  mutation signIn($email: String, $phone: String, $password: String!) {
    signIn(email: $email, phone: $phone, password: $password) {
      token
      error
    }
  }
`;
