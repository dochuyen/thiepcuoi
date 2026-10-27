import { useCallback, useEffect, useState } from 'react';

/** Gọi hàm async khi mount, trả về { data, error, loading, reload, setData } */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true }));
    return run()
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => setState({ data: null, error, loading: false }));
  }, [run]);

  useEffect(() => {
    reload();
  }, [reload]);

  const setData = (updater) =>
    setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater }));

  return { ...state, reload, setData };
}
