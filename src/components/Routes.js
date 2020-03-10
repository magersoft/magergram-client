import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LayoutDefault from '../layout/Default';
import LayoutMain from '../layout/Main';
import SignIn from '../routes/SignIn/SignIn';
import Feed from '../routes/Feed/Feed';
import Post from '../routes/Post/Post';
import Profile from '../routes/Profile/Profile';
import EditProfile from '../routes/EditProfile/EditProfile';
import Explore from '../routes/Explore/Explore';
import SignUp from '../routes/SignUp/SignUp';

const AppRouter = ({ isLoggedIn }) =>
  <BrowserRouter>
    { isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes /> }
  </BrowserRouter>;

const LoggedInRoutes = () =>
  <LayoutMain>
    <Switch>
      <Route path="/" exact={true} component={Feed} />
      <Route path="/explore" component={Explore} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/post/:postId" component={Post} />
      <Route path="/:username" component={Profile} />
      <Redirect from={'*'} to={'/'} />
    </Switch>
  </LayoutMain>;

const LoggedOutRoutes = () =>
  <LayoutDefault>
    <Switch>
      <Route path="/" exact={true} component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Redirect from={'*'} to={'/'} />
    </Switch>
  </LayoutDefault>;

AppRouter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppRouter;
