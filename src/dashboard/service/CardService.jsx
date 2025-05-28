let CardService = (function()
{
    let baseUrl = "https://avirup2512.github.io/projectManagement/";
    // let baseUrl = "http://localhost:8089/";
    function CardService()
    {
        
    }
    CardService.prototype.getAllCard = async function (listId,boardId)
    {
        const res = await fetch(baseUrl+'card/getAllCard/'+listId+"/"+boardId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+localStorage.getItem("token")
        },
        });
        return res.json();
    }
    CardService.prototype.createCard = async function (params)
    {
        const res = await fetch(baseUrl+'card/create',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    CardService.prototype.setStatus = async function (params)
    {
        const res = await fetch(baseUrl+'card/setStatus',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    CardService.prototype.editCard = async function (params)
    {
        const res = await fetch(baseUrl+'card/edit',{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    CardService.prototype.getCardById = async function (boardId,cardId)
    {
        const res = await fetch(baseUrl+'card/getCardById/'+boardId+'/'+cardId+'',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        });
        return res.json();
    }
    CardService.prototype.addUsers = async function (params)
    {
        const res = await fetch(baseUrl+'card/addUsers',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+ localStorage.getItem("token")
        },
        body: JSON.stringify(params),
        });
        return res.json();
    }
    return CardService;
})()

export default CardService;