import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PublicRoute from "./PublicRoute";
import PageLoader from "@/components/PageLoader";

const Login = lazy(() =>
  import(/*webpackChunkName:'LoginPage'*/ "@/pages/auth/Login")
);

const Logout = lazy(() =>
  import(/*webpackChunkName:'Logout'*/ "@/pages/auth/Logout")
);

const Register = lazy(() =>
  import(/*webpackChunkName:'RegisterPage'*/ "@/pages/auth/Register")
);

const EmailVerify = lazy(() =>
  import(/*webpackChunkName:'EmailVerify'*/ "@/pages/auth/EmailVerify")
);

const Meeting = lazy(() =>
  import(/*webpackChunkName:'Meeting'*/ "@/pages/auth/Meeting")
);

const NotFound = lazy(() =>
  import(/*webpackChunkName:'NotFoundPage'*/ "@/pages/NotFound")
);

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <PublicRoute path="/verify/:id/:token" component={EmailVerify} exact />
          <PublicRoute path="/meeting/" component={Meeting} exact />
          <PublicRoute component={Register} path="/register" exact />
          <PublicRoute component={Logout} path="/logout" exact />
          <PublicRoute
            path="/"
            component={Login}
            render={() => <Redirect to="/login" />}
          />
          <PublicRoute component={Login} path="/login" exact />
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
