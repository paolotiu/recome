import React, { createContext, useContext, useState } from "react";
import { IUser } from "./types";
const UserContext = createContext<IUser | {}>({});
const UserUpdateContext = createContext((user: IUser) => {});

export function useUser() {
  return useContext(UserContext);
}

export function useUpdateUser() {
  return useContext(UserUpdateContext);
}

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUser | {}>({});

  function updateUser(user: IUser) {
    setUser(user);
  }
  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={updateUser}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
};
