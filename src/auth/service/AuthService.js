let AuthService = (function()
{
    let baseUrl = "https://avirup2512.github.io/projectManagement/";
    // let baseUrl = "http://localhost:8089/";
    function AuthService()
    {
        
    }
    AuthService.prototype.createUser = async function (params)
    {
        const res = await fetch(baseUrl+'auth/createUser',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    AuthService.prototype.createUserFromSocialLogin = async function (params)
    {
        const res = await fetch(baseUrl+'auth/createUser',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    AuthService.prototype.login = async function (params)
    {
        const res = await fetch(baseUrl+'auth/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    AuthService.prototype.getUserDetails = async function (params)
    {
        const res = await fetch(baseUrl+'auth/getUser',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    return AuthService;
})()

export default AuthService;