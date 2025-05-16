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
    return ListService;
})()

export default ListService;