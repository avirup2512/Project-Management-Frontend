import { Navigate} from "react-router-dom";
import isAuthenticated from "../helper/auth";
import { useEffect, useState } from "react";
import { setDefaultProject, setHasDefaultProject, setUser } from "../auth/AuthSlice";
import { useDispatch } from "react-redux";
function AuthGuard({children})
{
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthentication] = useState(false);
    useEffect(() => {
        const verifyToken = async () => {            
            try {
                const user = await isAuthenticated();
                console.log(user);
                
                dispatch(setUser(user.data));
                let isVerify = (user && user.status && user.status == 200) ? true : false;
                if (isVerify)
                {
                    const defaultProject = { id: user.data?.projectId, name: user.data?.projectName, description: user.data?.projectDescription, createdDate: user.data?.projectCreatedAt, createdBy: user.data?.id };
                    dispatch(setDefaultProject(defaultProject));
                    dispatch(setHasDefaultProject(true));
                } else {
                    dispatch(setHasDefaultProject(false));
                }
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