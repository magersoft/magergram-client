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

const LoggedInRoutes = () =>
  <LayoutMain>
    <Route exact path="/" component={Feed} />
    <Route exact path="/edit-profile" component={EditProfile} />
    <Route exact path="/explore" component={Explore} />
    <Route exact path="/post/:id" component={Post} />
    <Route exact path="/:username" component={Profile} />
    <Redirect from={'*'} to={'/'} />
  </LayoutMain>;

const LoggedOutRoutes = () =>
  <LayoutDefault>
    <Route exact path="/" component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Redirect from={'*'} to={'/'} />
  </LayoutDefault>;

const AppRouter = ({ isLoggedIn }) =>
  <BrowserRouter>
    <Switch>
      { isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes /> }
    </Switch>
  </BrowserRouter>;

AppRouter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppRouter;
