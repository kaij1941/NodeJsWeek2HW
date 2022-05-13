const http = require('http');
const dotenv =require('dotenv');
const mongoose = require('mongoose');
const headers= require('./headers');
const postModel =require('./models/postModel');
const errorHandle =require('./errorHandle');
const { restart } = require('nodemon');
//資料庫連線
mongoose.connect('mongodb://localhost:27017/DbPractice')
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

    if(req.url == '/HW2' && req.method == "GET"){
        try {
            const postsData = await postModel.find();  
            res.write(JSON.stringify({
                "status":"success",
                "data":postsData
            }))     
            res.end();
        } catch (error) {
            console.log(error);
            errorHandle(res,400,'讀取資料錯誤');  
        } 
    }
    else if (req.url == '/HW2' && req.method == "POST") {
        req.on('end', async()=>{
            try {
                const data =JSON.parse(body);
                if (!data.articleContent) {
                    errorHandle(res,400,'文章內容為必填');
                    return;
                }

                if(!data.userName){
                    errorHandle(res,400,'發文者為必填');
                    return;
                }

                const newArticle= await postModel.create({
                    "articleContent":data.articleContent,
                    "articlePhoto":data.articlePhoto,
                    "userName":data.userName,
                    "userPhoto":data.userPhoto,
                    "likes":data.likes
                });

                res.writeHead(200, headers);
                res.write(JSON.stringify({
                  "status": "success",
                  "data": newArticle
                }))
                res.end();
            } catch (error) {
                errorHandle(res,400,'新增貼文錯誤');
                return;
            }
        });
    }else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    }
    else{       
        errorHandle(res,404,'發文者為必填');
        return;
    }

}

const server = http.createServer(requestListener);
server.listen(3005);
