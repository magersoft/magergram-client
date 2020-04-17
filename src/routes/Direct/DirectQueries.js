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
      }
      messages {
        id
        text
        from {
          id
          isSelf
        }
        to {
          id
        }
        createdAt
      }
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
      }
      to {
        id
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
      }
      to {
        id
      }
      createdAt
    }
  }
`;
