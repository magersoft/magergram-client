import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from '../routes/Auth/Auth';
import Feed from '../routes/Feed/Feed';
import Post from '../routes/Post/Post';
import Profile from '../routes/Profile/Profile';
import EditProfile from '../routes/EditProfile/EditProfile';
import Explore from '../routes/Explore/Explore';
import LayoutDefault from '../layout/Default';
import LayoutMain from '../layout/Main';

const LoggedInRoutes = () =>
  <LayoutMain>
    <Route exact path="/" component={Feed} />
    <Route path="/post" component={Post} />
    <Route path="/explore" component={Explore} />
    <Route path="/profile" component={Profile} />
    <Route path="/edit-profile" component={EditProfile} />
  </LayoutMain>;

const LoggedOutRoutes = () =>
  <LayoutDefault>
    <Route exact path="/" component={Auth} />
  </LayoutDefault>;

const AppRouter = ({ isLoggedIn }) =>
  <Router>
    <Switch>
      { isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes /> }
    </Switch>
  </Router>;

AppRouter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppRouter;
