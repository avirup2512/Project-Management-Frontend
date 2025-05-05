let BoardService = (function()
{
    let baseUrl = "http://localhost:8089/";
    function BoardService()
    {
        
    }
    BoardService.prototype.createUser = async function (params)
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
    BoardService.prototype.createUserFromSocialLogin = async function (params)
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
    BoardService.prototype.login = async function (params)
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

    return BoardService;
})()

export default BoardService;