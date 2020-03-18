import { gql } from 'apollo-boost';

export const USER_INFO = gql`
 query myProfile {
   myProfile {
     id
     username
     avatar
   }
 }
`;
