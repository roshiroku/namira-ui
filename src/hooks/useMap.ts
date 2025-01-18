import { useCallback, useMemo, useRef } from 'react';

const useMap = <K>(values: K[] = []) => {
  const key = useRef(1);
  const { current: keys } = useRef(new Map<K, number>());
  const map = useMemo(() => {
    const map = new Map<number, K>();
    values.forEach((val) => {
      if (!keys.has(val)) {
        keys.set(val, key.current++);
      }
      map.set(keys.get(val)!, val);
    });
    return map;
  }, [values]);

  const getKey = useCallback((val: K) => keys.get(val), []);
  const getValue = useCallback((k: number) => map.get(k), [map]);

  return { map, getKey, getValue };
};

export default useMap;
