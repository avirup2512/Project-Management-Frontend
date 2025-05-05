import AuthService from "../auth/service/AuthService";

async function isAuthenticated()
{
    const authService = new AuthService();
    if (localStorage.getItem("token") !== null)
    {
        try {
            const user = await authService.getUserDetails({ token: localStorage.getItem("token") });
            return (user.status && user.status == 200) ? true : false;
        } catch (error) {
            return false;
        }
    }
    return false;
}
export default isAuthenticated;