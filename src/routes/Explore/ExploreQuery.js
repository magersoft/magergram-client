import { gql } from 'apollo-boost';

export const SEE_EXPLORE = gql`
  query seeExplore {
    seeExplore {
      id
      caption
      location
      likeCount
      commentCount
      files {
        id
        url
      }
    }
  }
`;
