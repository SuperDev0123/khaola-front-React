import React, { useEffect, lazy } from "react";
import { useParams, useLocation } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { request } from "@/request";
const Loading = lazy(() =>
  import(/*webpackChunkName:'Loading'*/ "@/components/Loading")
);

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Meeting = () => {
  let query = useQuery();
  let client_id = query.get('client')
  const asyncList = () => {
    return request.post('meeting', { client_id });
  };
  const { result, isLoading, isSuccess } = useFetch(asyncList);
  if(isSuccess){
    window.location.href = query.get('url')
  }
  return (
    <Loading />
  );
};

export default Meeting;