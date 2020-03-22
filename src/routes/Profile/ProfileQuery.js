import { gql } from 'apollo-boost';

export const SEE_USER = gql`
  query seeUser($username: String!) {
    seeUser(username: $username) {
      id
      avatar
      username
      fullName
      bio
      website
      followingCount
      followersCount
      postsCount
      isFollowing
      posts {
        id
        caption
        likeCount
        commentCount
        files {
          id
          url
        }
      }
      followers {
        id
        username
        avatar
        fullName
        isFollowing
      }
      following {
        id
        username
        avatar
        fullName
        isFollowing
      }
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

export const FOLLOW = gql`
  mutation follow($id: String!) {
    follow(id: $id)
  }
`;

export const UNFOLLOW = gql`
  mutation unfollow($id: String!) {
    unfollow(id: $id)
  }
`;
