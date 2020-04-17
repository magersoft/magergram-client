import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoaderJSX } from '../../components/Loader';
import style from './Direct.module.scss';

const Inbox = lazy(() => import('./Inbox/Inbox'));
const New = lazy(() => import('./New/New'));
const Room = lazy(() => import('./Room/Room'));

export default () => {
  return (
    <React.Fragment>
      <Suspense fallback={LoaderJSX()}>
        <Route path="/direct/inbox" component={Inbox} />
        <Route path="/direct/new" component={New} />
        <Route path="/direct/t/:id" component={Room} />
      </Suspense>
    </React.Fragment>
  )
}
