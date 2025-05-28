let BoardService = (function()
{
    let baseUrl = "https://avirup2512.github.io/projectManagement/";
    // let baseUrl = "http://localhost:8089/";
    function BoardService()
    {
        
    }
    BoardService.prototype.getAllBoards = async function (token)
    {
        const res = await fetch(baseUrl+'board/getAllBoard',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+token
        },
        });
        return res.json();
    }
    BoardService.prototype.createBoard = async function (params)
    {
        const res = await fetch(baseUrl+'board/create',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    BoardService.prototype.editBoard = async function (params)
    {
        const res = await fetch(baseUrl+'board/edit',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    BoardService.prototype.searchUser = async function (keyword)
    {
        const res = await fetch(baseUrl+'auth/search',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify({keyword}),
        });
        return res.json();
    }
    BoardService.prototype.getAllRoles = async function ()
    {
        const res = await fetch(baseUrl+'setting/getRoles',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        });
        return res.json();
    }
    BoardService.prototype.deleteBoard = async function (id)
    {
        const res = await fetch(baseUrl+'board/delete',{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
            },
            body: JSON.stringify({boardId:id})
        });
        return res.json();
    }
    BoardService.prototype.searchBoardUser = async function (keyword,boardId)
    {
        const res = await fetch(baseUrl+'auth/searchByBoardId',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify({keyword,boardId}),
        });
        return res.json();
    }

    return BoardService;
})()

export default BoardService;