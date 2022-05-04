import React, { useEffect, useState, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyClient } from "@/redux/auth/actions";
import { useDispatch } from "react-redux";
const Loading = lazy(() =>
  import(/*webpackChunkName:'EmailVerify'*/ "@/components/Loading")
);

const EmailVerify = () => {
  const param = useParams();
  try {
    const dispatch = useDispatch();
    dispatch(verifyClient(param));    
  } catch (error) {
    console.log(error);
  }

  return (
    <Loading />
  );
};

export default EmailVerify;