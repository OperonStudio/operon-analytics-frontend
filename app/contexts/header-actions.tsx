import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ActionHandler = () => void;

interface HeaderActionContextValue {
  handlers: Record<string, ActionHandler>;
  register: (actions: Record<string, ActionHandler>) => void;
  unregister: (actionIds: string[]) => void;
}

const HeaderActionContext = createContext<HeaderActionContextValue | null>(
  null,
);

/**
 * Lets the page header render buttons whose behaviour lives in the page below
 * it. The header is mounted once by the shell, so a page publishes its actions
 * here on mount and withdraws them on unmount.
 */
export const HeaderActionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [handlers, setHandlers] = useState<Record<string, ActionHandler>>({});

  // register and unregister are memoised because consumers depend on them from
  // an effect. Recreating them each render would re-run that effect on every
  // state change, which re-registers, which sets state again.
  const register = useCallback((actions: Record<string, ActionHandler>) => {
    setHandlers((prev) => ({ ...prev, ...actions }));
  }, []);

  const unregister = useCallback((actionIds: string[]) => {
    setHandlers((prev) => {
      const next = { ...prev };
      for (const id of actionIds) delete next[id];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ handlers, register, unregister }),
    [handlers, register, unregister],
  );

  return (
    <HeaderActionContext.Provider value={value}>
      {children}
    </HeaderActionContext.Provider>
  );
};

/**
 * Registers a page's header actions for as long as the page is mounted.
 *
 * The handlers are held in a ref and invoked through a stable proxy, so a page
 * can pass a fresh inline object every render without re-registering, and the
 * proxy always calls the current closure rather than the one from mount.
 */
export const useHeaderActions = (actions: Record<string, ActionHandler>) => {
  const context = useContext(HeaderActionContext);
  if (!context) {
    throw new Error(
      "useHeaderActions must be used within a HeaderActionProvider",
    );
  }

  const { register, unregister } = context;
  const actionsRef = useRef(actions);

  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  // Registration is keyed on the set of action ids, not the handlers, so a
  // page that renames or adds an action re-registers and one that merely
  // re-renders does not.
  const actionIdKey = Object.keys(actions).sort().join("|");

  useEffect(() => {
    const actionIds = actionIdKey ? actionIdKey.split("|") : [];
    const proxyActions: Record<string, ActionHandler> = {};
    for (const id of actionIds) {
      proxyActions[id] = () => actionsRef.current[id]?.();
    }

    register(proxyActions);
    return () => unregister(actionIds);
  }, [actionIdKey, register, unregister]);
};

export const useHeaderActionHandler = (
  actionId: string,
): ActionHandler | undefined => {
  const context = useContext(HeaderActionContext);
  if (!context) {
    throw new Error(
      "useHeaderActionHandler must be used within a HeaderActionProvider",
    );
  }
  return context.handlers[actionId];
};
