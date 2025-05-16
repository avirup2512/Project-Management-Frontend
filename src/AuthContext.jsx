import { createContext, useContext, useState } from "react"

const AuthContext = createContext();
export const AuthProvider = function ({ children })
{
    const [loggedInUser, setUser] = useState(null);
    return (
        <AuthContext.Provider value={{ loggedInUser, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext) ; 