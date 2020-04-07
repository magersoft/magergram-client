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
      isSelf
      isPrivate
      isRequestingSubscription
      followers {
        id
        username
        avatar
        fullName
        isFollowing
        isSelf
        isPrivate
        isRequestingSubscription
      }
      following {
        id
        username
        avatar
        fullName
        isFollowing
        isSelf
        isPrivate
        isRequestingSubscription
      }
    }
  }
`;

export const SEE_USER_POSTS = gql`
  query seeUserPosts($username: String!, $perPage: Int!, $page: Int!) {
    seeUserPosts(username: $username, perPage: $perPage, page: $page) {
      id
      caption
      likeCount
      commentCount
      files {
        id
        url
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

export const REQUEST_FOLLOW = gql`
  mutation requestFollow($subscriberId: String!) {
    requestFollow(subscriberId: $subscriberId)
  }
`;

export const CANCEL_FOLLOW = gql`
  mutation cancelFollow($subscriberId: String!) {
    cancelFollow(subscriberId: $subscriberId)
  }
`;
