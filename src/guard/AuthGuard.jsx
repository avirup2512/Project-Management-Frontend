import { Navigate} from "react-router-dom";
import isAuthenticated from "../helper/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
function AuthGuard({children})
{
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthentication] = useState(false);
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const user = await isAuthenticated();
                setUser(user.data);
                let isVerify = (user && user.status && user.status == 200) ? true : false
                setAuthentication(isVerify);
            } catch (error) {
                setAuthentication(false);
            } finally {
                setLoading(false)
            }
        }
        verifyToken();
    }, []);
    if (loading)
    {
        return "Loading ....";
    }    
    if (!authenticated)
    {
        return <Navigate to="/auth" />;
    }
    return children
}
export default AuthGuard;