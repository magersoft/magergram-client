import { gql } from 'apollo-boost';

export const MY_FOLLOWING = gql`
  query seeUsersForMessage {
    seeUsersForMessage {
      id
      username
      avatar
      fullName
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation createRoomMessages($toId: String!) {
    createRoomMessages(toId: $toId) {
      id
    }
  }
`;

export const SEE_ROOMS = gql`
  query seeRooms {
    seeRooms {
      id
      participants {
        id
        username
        avatar
      }
      lastMessage {
        id
        text
        isRead
        createdAt
      }
    }
  }
`;

export const SEE_ROOM = gql`
  query seeRoom($id: String!) {
    seeRoom(id: $id) {
      id
      participants {
        id
        username
        avatar
        isSelf
      }
    }
  }
`;

export const SEE_MESSAGES = gql`
  query seeMessages($roomId: String!, $perPage: Int!, $page: Int!) {
    seeMessages(roomId: $roomId, perPage: $perPage, page: $page) {
      id
      text
      from {
        id
        username
        avatar
      }
      to {
        id
        username
        avatar
      }
      createdAt
    }
  }
`;

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription newMessage($roomId: String!) {
    newMessage(roomId: $roomId) {
      id
      text
      from {
        id
        username
        avatar
      }
      to {
        id
        username
        avatar
      }
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($roomId: String, $message: String!, $toId: String) {
    sendMessage(roomId: $roomId, message: $message, toId: $toId) {
      id
      text
      from {
        id
        username
        avatar
      }
      to {
        id
        username
        avatar
      }
      createdAt
    }
  }
`;

export const TYPING_MESSAGE = gql`
  mutation typingMessage($roomId: String!, $toUserId: String!, $typing: Boolean!) {
    typingMessage(roomId: $roomId, toUserId: $toUserId, typing: $typing)
  }
`;

export const SUBSCRIPTION_TYPING_MESSAGE = gql`
  subscription typingMessage {
    typingMessage
  }
`;
