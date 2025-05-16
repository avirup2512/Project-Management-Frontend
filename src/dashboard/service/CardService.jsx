let CardService = (function()
{
    let baseUrl = "http://localhost:8089/";
    function CardService()
    {
        
    }
    CardService.prototype.getAllCard = async function (boardId)
    {
        const res = await fetch(baseUrl+'card/getAllList/'+boardId,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization':"Bearer "+localStorage.getItem("token")
        },
        });
        return res.json();
    }
    CardService.prototype.createList = async function (params)
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
    return CardService;
})()

export default CardService;