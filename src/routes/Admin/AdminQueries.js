import { gql } from 'apollo-boost';

export const UPLOAD_GENERATED_FILTERS = gql`
  mutation uploadFilteredPreview($file: Upload!) {
    uploadFilteredPreview(file: $file) {
      path
    }
  }
`;
