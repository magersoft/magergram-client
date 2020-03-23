import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { getMainDefinition } from 'apollo-utilities';
import { localState, resolvers } from './LocalState';
import { toast } from 'react-toastify';

const isDev = process.env.NODE_ENV === 'development';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const getToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return `Bearer ${token}`
  } else {
    return void 0;
  }
};

const httpLink = createUploadLink({
  uri: API_URL
});

const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'Authorization': getToken()
    }
  });
  return forward(operation);
});

const wsLink = new WebSocketLink({
  options: {
    connectionParams: {
      'Authorization': getToken()
    },
    reconnect: true
  },
  uri: isDev ? 'ws://localhost:4000' : ''
});

const combinedLinks = split(({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription'
}, wsLink, httpLink);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) => {
      toast.error(`Unexpected error: ${message}`);
      return message;
    });
  }
  if (networkError) {
    toast.error(`Network Error: ${networkError}`)
  }
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([
    errorLink,
    concat(authMiddleware, combinedLinks)
  ]),
  resolvers
});

cache.writeData({
  data: localState
});

export default client;
