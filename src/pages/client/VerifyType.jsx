import React from "react";
import { useParams, Link } from "react-router-dom";
import success from "./images/success.png"
import "./auth.less"
import { Space } from "antd";
import useFetch from "@/hooks/useFetch";
import { request } from "@/request";

const VerifyType = () => {
  const asyncList = () => {
    return request.get('client/is_verify');
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList);
  console.log(result)
  return (
    (result && <div className='email-verify'>
      <img src={success} alt="success_img" className='success_img' />
      <h2 style={{paddingTop: 8}}>{result.reserved ? 'You are already reserve video call. Please wait for a call' : ((result.verify ? 'Identity' : 'Email') + 'verified successfully')}</h2>
      <Space />
      {result.verify ? '' : (
        result.reserved ? '' :
          <>
            <h1>Select your type to verify.</h1>
            <Link to="/verify/ID">
              <div className="container-login100-form-btn">
                ID Verification
              </div>
            </Link>
            <Link to="/verify/call">
              <div className="container-login100-form-btn">
                Video Call
              </div>
            </Link></>
      )}
    </div>)
  );
};

export default VerifyType;