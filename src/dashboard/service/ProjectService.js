import config from "../../config";
let ProjectService = (function ()
{
    let baseUrl = config.baseUrl;
    function ProjectService()
    {
        
    }
    ProjectService.prototype.getAllProject = async function (token,itemLimit,offset)
    {
        const res = await fetch(baseUrl+'project/getAllProject/'+itemLimit+'/'+offset+'',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+token
        },
        });
        return res.json();
    }
    ProjectService.prototype.createProject = async function (params)
    {
        const res = await fetch(baseUrl+'project/create',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    ProjectService.prototype.editProject = async function (params)
    {
        const res = await fetch(baseUrl+'project/edit',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    ProjectService.prototype.searchUser = async function (keyword)
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
    ProjectService.prototype.getAllRoles = async function ()
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
    ProjectService.prototype.deleteBoard = async function (id)
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
    ProjectService.prototype.searchBoardUser = async function (keyword,boardId)
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
    ProjectService.prototype.searchUser = async function (keyword)
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

    return ProjectService;
})()

export default ProjectService;