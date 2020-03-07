import { gql } from 'apollo-boost';

export const SIGN_UP = gql`
  mutation createAccount(
    $username: String!, 
    $email: String,
    $phone: String,
    $password: String!, 
    $firstName: String, 
    $lastName: String
  ) 
  {
    createAccount(
      username: $username, 
      email: $email, 
      phone: $phone,
      password: $password, 
      firstName: $firstName, 
      lastName: $lastName
    ) {
      ok
      error
    }
  }
`;

export const EXIST_USER = gql`
  mutation checkExistUsername($username: String!) {
    checkExistUsername(username: $username) {
      ok
      error
    }
  }
`;

export const CONFIRM_SECRET = gql`
  mutation confirmSecret($secret: String!, $email: String, $phone: String) {
    confirmSecret(secret: $secret, email: $email, phone: $phone)
  }
`;
