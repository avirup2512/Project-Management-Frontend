export const polyfill = {
    deepCopy: function (data)
    {
        if (typeof data != 'object')
            return data;
        let clone = Array.isArray(data) ? [] : {};  
        for (let x in data)
        {
            const value = data[x];
            clone[x] = this.deepCopy(value);
        };
        return clone;
    }
}
