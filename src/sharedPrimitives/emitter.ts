/**
 * usage:
 * const emitter = createEmitter();
 * const unsubscribe = emitter.subscribe(()=>{triggeredFn()});
 * emitter.emit();
 * unsubscribe();
 */
export const createEmitter = () => {
  const listeners = new Set<() => void>();

  return {
    emit: () => {
      for (const l of listeners) l();
    },
    subscribe: (fn: () => void) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
};

export type Emitter = ReturnType<typeof createEmitter>;
