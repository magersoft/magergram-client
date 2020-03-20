export const localState = {
  isLoggedIn: Boolean(localStorage.getItem('token')),
  loading: false
};

export const resolvers = {
  Mutation: {
    logUserIn: (_, { token }, { cache }) => {
      localStorage.setItem('token', token);
      cache.writeData({
        data: {
          isLoggedIn: true
        }
      });
      return null;
    },
    logUserOut: (_, __, { cache }) => {
      localStorage.removeItem('token');
      cache.writeData({
        data: {
          isLoggedIn: false
        }
      });
      return null;
    },
    setLoading: (_, __, { cache }) => {
      cache.writeData({
        data: {
          loading: true
        }
      })
    },
    removeLoading: (_, __, { cache }) => {
      cache.writeData({
        data: {
          loading: false
        }
      })
    }
  }
};
