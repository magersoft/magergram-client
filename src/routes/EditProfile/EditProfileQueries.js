import { gql } from 'apollo-boost';

export const EDIT_USER = gql`
  mutation editUser(
    $username: String, 
    $email: String, 
    $phone: String, 
    $firstName: String,
    $lastName: String,
    $bio: String,
    $website: String,
    $avatar: String) {
    editUser(
      username: $username,
      email: $email,
      phone: $phone,
      firstName: $firstName,
      lastName: $lastName,
      website: $website,
      bio: $bio,
      avatar: $avatar
    ) {
      id
      avatar
      username
      fullName
      firstName
      lastName
      email
      phone
      website
      bio
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      ok
      error
    }
  }
`;

export const TOGGLE_DARK_MODE = gql`
  mutation darkMode($darkMode: Boolean!) {
    darkMode(darkMode: $darkMode)
  }
`;

export const CHANGE_LANGUAGE = gql`
  mutation changeLanguage($lang: String!) {
    changeLanguage(lang: $lang)
  }
`;

export const PRIVATE_ACCOUNT = gql`
  mutation privateAccount($state: Boolean!) {
    privateAccount(state: $state)
  }
`;

export const EMAIL_NOTIFICATION = gql`
  mutation toggleEmailNotification($state: Boolean!) {
    toggleEmailNotification(state: $state)
  }
`;
