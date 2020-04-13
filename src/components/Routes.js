import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LayoutDefault from '../layout/Default';
import LayoutMain from '../layout/Main';
import ScrollToTop from '../utils/ScrollToTop';
import { LoaderJSX } from './Loader';

const SignIn = lazy(() => import('../routes/SignIn/SignIn'));
const SignUp = lazy(() => import('../routes/SignUp/SignUp'));
const Feed = lazy(() => import('../routes/Feed/Feed'));
const Post = lazy(() => import('../routes/Post/Post'));
const Profile = lazy(() => import('../routes/Profile/Profile'));
const EditProfile = lazy(() => import('../routes/EditProfile/EditProfile'));
const Explore = lazy(() => import('../routes/Explore/Explore'));
const AddPost = lazy(() => import('../routes/AddPost/AddPost'));
const Activity = lazy(() => import('../routes/Activity/Activity'));
const Direct = lazy(() => import('../routes/Direct/Direct'));
const GenerateFilterPreview = lazy(() => import('../routes/Admin/GenerateFilterPreview'));

const AppRouter = ({ isLoggedIn }) =>
  <BrowserRouter>
    <ScrollToTop />
    { isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes /> }
  </BrowserRouter>;

const LoggedInRoutes = () =>
  <LayoutMain>
    <Suspense fallback={LoaderJSX()}>
      <Switch>
        <Route path="/" exact={true} component={Feed} />
        <Route path="/add-post" component={AddPost} />
        <Route path="/explore" component={Explore} />
        <Route path="/edit-profile" component={EditProfile} />
        <Route path="/activity" component={Activity} />
        <Route path="/direct" component={Direct} />
        <Route path="/generate-filter-preview" component={GenerateFilterPreview} />
        <Route path="/post/:postId" component={Post} />
        <Route path="/:username" component={Profile} />
        <Redirect from={'*'} to={'/'} />
      </Switch>
    </Suspense>
  </LayoutMain>;

const LoggedOutRoutes = () =>
  <LayoutDefault>
    <Suspense fallback={LoaderJSX()}>
      <Switch>
        <Route path="/" exact={true} component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Redirect from={'*'} to={'/'} />
      </Switch>
    </Suspense>
  </LayoutDefault>;

AppRouter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppRouter;
