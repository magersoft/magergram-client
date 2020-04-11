export const localState = {
  isLoggedIn: Boolean(localStorage.getItem('token')),
  loading: false,
  lang: 'ru',
  darkMode: localStorage.getItem('darkMode') === 'true',
  serviceWorkerUpdated: false,
  serviceWorkerRegistration: null
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
    },
    setLanguage: (_, { lang }, { cache }) => {
      localStorage.setItem('lang', lang);
      cache.writeData({
        data: {
          lang
        }
      })
    },
    toggleDarkMode: (_, { darkMode }, { cache }) => {
      localStorage.setItem('darkMode', darkMode);
      cache.writeData({
        data: {
          darkMode
        }
      })
    }
  }
};
