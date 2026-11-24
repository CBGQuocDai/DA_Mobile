import { useCallback, useEffect, useState } from "react";

/** Debounce typing, but apply submission, clearing and incoming navigation immediately. */
export function useSearchTerm(initialValue = "") {
  const [query, setInput] = useState(initialValue);
  const [keyword, setKeyword] = useState(initialValue.trim());

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const setQuery = useCallback((value: string) => {
    setInput(value);
    if (!value.trim()) setKeyword("");
  }, []);
  const applyQuery = useCallback((value: string) => {
    setInput(value);
    setKeyword(value.trim());
  }, []);
  const submitQuery = () => setKeyword(query.trim());

  return {
    query,
    keyword,
    isDebouncing: query.trim() !== keyword,
    setQuery,
    applyQuery,
    submitQuery,
  };
}
