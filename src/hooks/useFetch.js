import { useEffect, useRef, useState } from "react";

function useFetch(fetcher, deps) {
  const key = JSON.stringify(deps);
  const fetcherRef = useRef(fetcher);
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let ignore = false;

    fetcherRef
      .current()
      .then((data) => {
        if (!ignore) setResult({ key, data, error: "" });
      })
      .catch((error) => {
        if (!ignore) setResult({ key, data: null, error: error.message });
      });

    return () => {
      ignore = true;
    };
  }, [key]);

  const isLoading = result.key !== key;

  return {
    data: isLoading ? null : result.data,
    error: isLoading ? "" : result.error,
    isLoading,
  };
}

export default useFetch;