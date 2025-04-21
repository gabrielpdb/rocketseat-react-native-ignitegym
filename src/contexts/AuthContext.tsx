import { UserDTO } from "@dtos/UserDTO"
import { createContext, ReactNode, useContext, useState } from "react"

export type AuthContextDataProps = {
  user: UserDTO
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({
    id: "1",
    name: "Gabriel",
    email: "gabriel@email.com",
    avatar: "gabriel.png",
  })

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}
