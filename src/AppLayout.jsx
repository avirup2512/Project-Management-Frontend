import { useEffect } from "react"
import { useLocation } from "react-router-dom";


function AppLayout({ children }) {
    const location = useLocation();
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
    return <>{children}</>;
}

export default AppLayout
