import { useState, useEffect } from 'react';

function useTriggerEffect<T>(initialState) {
  const [state, setState] = useState(initialState);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    setTrigger(prevTrigger => !prevTrigger);
  }, [state]);

  return [state, setState];
}

export default useTriggerEffect;