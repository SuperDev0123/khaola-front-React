import React, { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "@/components/PageLoader";


import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";

const ClientList = lazy(() =>
  import(/*webpackChunkName:'ClientListPage'*/ "@/pages/provider/ClientList")
);

const VerifyType = lazy(() =>
  import(/*webpackChunkName:'VerifyType'*/ "@/pages/client/VerifyType")
);

const VerifyID = lazy(() =>
  import(/*webpackChunkName:'VerifyID'*/ "@/pages/client/VerifyID")
);

const VerifyCall = lazy(() =>
  import(/*webpackChunkName:'VerifyCall'*/ "@/pages/client/VerifyCall")
);

const Logout = lazy(() =>
  import(/*webpackChunkName:'LogoutPage'*/ "@/pages/Logout")
);
const NotFound = lazy(() =>
  import(/*webpackChunkName:'NotFoundPage'*/ "@/pages/NotFound")
);

export default function AppRouter() {
  const location = useLocation();
  const { current } = useSelector(selectAuth);

  useEffect(() => {
    console.log("role : ", current.role);
  }, [current.role]);
  console.log(current.id)
  if (current.role === 'provider')
    return (
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <Switch location={location} key={location.pathname}>
            <Route path="/" component={ClientList} render={() => <Redirect to="/clients" />} />
            <PrivateRoute path="/clients" component={ClientList} exact />

            <PrivateRoute component={Logout} path="/logout" exact />
            <PublicRoute path="/login" render={() => <Redirect to="/" />} />
            <Route
              path="*"
              component={NotFound}
              render={() => <Redirect to="/notfound" />}
            />
          </Switch>
        </AnimatePresence>
      </Suspense>
    );
  else if (current.role === 'admin')
    return (
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <Switch location={location} key={location.pathname}>
            <Route path="/" component={ClentList} render={() => <Redirect to="/providers" />} />
            <PrivateRoute path="/providers" component={ClientList} exact />

            <PrivateRoute component={Logout} path="/logout" exact />
            <PublicRoute path="/login" render={() => <Redirect to="/" />} />
            <Route
              path="*"
              component={NotFound}
              render={() => <Redirect to="/notfound" />}
            />
          </Switch>
        </AnimatePresence>
      </Suspense>
    );
  else if (current.role === 'client')
    return (
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <Switch location={location} key={location.pathname}>
            <PrivateRoute path="/verify/type" component={VerifyType} exact />
            <PrivateRoute path="/verify/ID" component={VerifyID} exact />
            <PrivateRoute path="/verify/call" component={VerifyCall} exact />
            <PublicRoute path="/verify/:id/:token" component={VerifyType} exact />
            <PrivateRoute component={Logout} path="/logout" exact />
            <PublicRoute path="/login" render={() => <Redirect to="/" />} />
            <Route exact path="/" component={VerifyType} render={() => <Redirect to="/verify/type" />} />
            <Route
              path="*"
              component={NotFound}
              render={() => <Redirect to="/notfound" />}
            />
          </Switch>
        </AnimatePresence>
      </Suspense>
    );
  else {
    return (
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <Switch location={location} key={location.pathname}>
            <PrivateRoute component={Logout} path="/logout" exact />
            <PublicRoute path="/login" render={() => <Redirect to="/" />} />
            <Route
              path="*"
              component={NotFound}
              render={() => <Redirect to="/notfound" />}
            />
          </Switch>
        </AnimatePresence>
      </Suspense>
    );
  }
}
