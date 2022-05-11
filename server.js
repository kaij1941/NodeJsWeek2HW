const http = require('http');
const mongoose =require('mongoose');
const dotenv =require('dotenv');

const headers= require('./headers');
const postModel =require('./models/postModel');

//資料庫連線
mongoose.connect('mongodb://localhost:27017/hotel')
    .then(()=>{
        console.log("資料庫連線成功")
    }).catch((error)=>{
        console.log(error);
    })
//環境設定
dotenv.config({path: './config.env'});

const requestListener = async(req,res)=>{
    let body=""
    req.on('data',chunk=>{
        body+=chunk;
    })

    if (req.url == '/HW2' && req.method == "POST") {
        res.end('end', async()=>{
            try {
                const data =JSON.parse(body);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        });
    }else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    }
    else{       
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status":"false",
            "message":"無此網站路由"
        }))
        res.end()
    }

}

const server = http.createServer(requestListener);
server.listen(3005);