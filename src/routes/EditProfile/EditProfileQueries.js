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
