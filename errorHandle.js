const headers= require('./headers');
const errorHandle =(res,httpCode,errorMsg)=>{
    res.writeHead(httpCode,headers);
    res.write(JSON.stringify({
        "status":"false",
        "message":errorMsg
    }))
    res.end();
}

module.exports = errorHandle;