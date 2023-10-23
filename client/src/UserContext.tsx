import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { FMProfile, Profile } from "./interfaces";
import { createUser } from "./service/user.service";
import { googleLogout } from "@react-oauth/google";

type User = {
  access_token: string;
  // Add other user properties as needed
};

type UserContextType = {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setProfile: React.Dispatch<React.SetStateAction<FMProfile | null>>;
  logOut: () => void;
  profile: FMProfile | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profile, setProfile] = useState<FMProfile | null>(null);
  const logOut = () => {
    googleLogout();
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then(async (res) => {
          const profile = await createUser(res.data);
          setProfile(profile);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ setUser, profile, setProfile, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
