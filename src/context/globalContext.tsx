import {useState, Dispatch, SetStateAction} from "react";
import { createContext } from "use-context-selector";

import { UserDto } from "../models/dtos/user";
 
type GlobalContextType = {
  user: UserDto;
  setUser: Dispatch<SetStateAction<UserDto | null>>;
};

export const GlobalContext = createContext<GlobalContextType>(null);

export function GlobalProvider({ children }) {
  const [user, setUser] = useState<UserDto | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
