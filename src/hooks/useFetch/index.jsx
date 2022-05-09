import { useState, useEffect } from "react";

export default function useFetch(fetchingFn, refresh = false) {
  const [result, setResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const fetchData = async () => {
    setIsLoading(true);
    
    const data = await fetchingFn();
    console.log(data, 'fetching data')
    if (data.success === true) {
      setIsSuccess(true);
      setResult(data.result);
    }
    setIsLoading(false);
  };
  console.log(refresh)
  if (refresh) fetchData();
  
  useEffect(() => {
    console.log('fetching data')
    fetchData();
  }, []);
  return { result, isSuccess, isLoading };
}
