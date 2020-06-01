import { gql } from 'apollo-boost';

export const RECOVERY_PASSWORD = gql`
  mutation recoveryPassword($usernameOrEmail: String!) {
    recoveryPassword(usernameOrEmail: $usernameOrEmail) {
      ok
      error
    }
  }
`

export const RECOVERY_PASSWORD_TOKEN = gql`
  mutation recoveryPasswordByToken($token: String!) {
    recoveryPasswordByToken(token: $token) {
      ok
      error
      user {
        id
      }
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation resetPassword($userId: String!, $newPassword: String!, $confirmPassword: String!) {
    resetPassword(userId: $userId, newPassword: $newPassword, confirmPassword: $confirmPassword) {
      ok
      error
    }
  }
`;
