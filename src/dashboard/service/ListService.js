let ListService = (function()
{
    let baseUrl = "http://localhost:8089/";
    function ListService()
    {
        
    }
    ListService.prototype.getAllList = async function (boardId)
    {
        const res = await fetch(baseUrl+'list/getAllList/'+boardId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+localStorage.getItem("token")
        },
        });
        return res.json();
    }
    ListService.prototype.createList = async function (params)
    {
        const res = await fetch(baseUrl+'list/create',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    ListService.prototype.editList  = async function (params)
    {
        const res = await fetch(baseUrl+'list/edit',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    ListService.prototype.updateListPosition = async function (params)
    {
        const res = await fetch(baseUrl+'list/updatePosition',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    return ListService;
})()

export default ListService;