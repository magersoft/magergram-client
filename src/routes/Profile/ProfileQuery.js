import { gql } from 'apollo-boost';

export const MY_PROFILE = gql`
  query myProfile {
    myProfile {
      id
      avatar
      username
      fullName
      bio
      website
      followingCount
      followersCount
      postsCount
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation updateAvatar($avatar: String!) {
    editUser(avatar: $avatar) {
      avatar
    }
  }
`;
