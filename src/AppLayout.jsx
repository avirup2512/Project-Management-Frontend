import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Loader from "./shared/Loader";


function AppLayout({ children }) {
    const location = useLocation();
    const showLoader = useSelector((e) => e.app.showLoader);
    useEffect(() => {
    },[showLoader])
    useEffect(() => {
        //Remove all previous custom classes from body tag
        document.body.classList = "";
        // Add classes conditionally based on route
        if (location.pathname.startsWith("/auth"))
        {
            document.body.classList.add("authentication")
            document.body.classList.remove("dashboard")
        } else if (location.pathname.startsWith("/dashboard")) {
            document.body.classList.remove("authentication")
            document.body.classList.add("dashboard")
        }
            
    })
    if (showLoader)
    return <Loader/>
    return <>{children}</>;
}

export default AppLayout
