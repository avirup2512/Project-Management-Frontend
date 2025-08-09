import config from "../config";
let DateService = (function ()
{
    let baseUrl = config.baseUrl;
    function DateService()
    {
        
    }
    DateService.prototype.FromUTCToLocal = function (utcString)
    {        
        const utcDate = new Date(utcString);        
        const year = utcDate.getFullYear();
        const month = String(utcDate.getMonth() + 1).padStart(2, '0');
        const day = String(utcDate.getDate()).padStart(2, '0');
        const hours = String(utcDate.getHours()).padStart(2, '0');
        const minutes = String(utcDate.getMinutes()).padStart(2, '0');
        const seconds = String(utcDate.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return DateService;
})()

export default DateService;