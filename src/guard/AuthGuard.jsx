import { Navigate} from "react-router-dom";
import isAuthenticated from "../helper/auth";
import { useEffect, useState } from "react";
function AuthGuard({children})
{
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthentication] = useState(false);
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const isverify = await isAuthenticated();
                setAuthentication(isverify);
            } catch (error) {
                setAuthentication(false);
            } finally
            {
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