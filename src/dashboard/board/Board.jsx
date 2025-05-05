import { useContext, useEffect } from "react";
import AuthService from "../../auth/service/AuthService";
import { DashboardMessageContext } from "../DashboardMessageContext";

function Board({onTrigger})
{
    const { setMessage } = useContext(DashboardMessageContext);
    useEffect(() => {
        const getUser = async function ()
        {
            const user = await authService.getUserDetails({token:localStorage.getItem("token")})
            setMessage(user);
        }        
        // getUser();
    },[])
    const authService = new AuthService();
    

    return "Boards working";
}

export default Board;