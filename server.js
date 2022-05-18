const http = require('http');
const dotenv =require('dotenv');
const mongoose = require('mongoose');
const headers= require('./headers');
const postModel =require('./models/postModel');
const errorHandle =require('./errorHandle');
//環境設定
dotenv.config({path: './config.env'});

const DB= process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD)
//資料庫連線
mongoose.connect(DB)
    .then(()=>{
        console.log("資料庫連線成功")
    }).catch((error)=>{
        console.log(error);
    })

const requestListener = async(req,res)=>{
    let body=""
    req.on('data',chunk=>{
        body+=chunk;
    })

    if(req.url == '/posts' && req.method == "GET"){
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
    else if (req.url == '/posts' && req.method == "POST") {
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
    }else if (req.url.startsWith('/posts/') && req.method == "PATCH") {
        req.on('end', async()=>{
            try {
                const data =JSON.parse(body);

                const id = req.url.split('/').pop();
                const postCheckResult = await postModel.findById(id)
                if (!postCheckResult) {
                    errorHandle(res,400,'找不到此貼文');
                    return;
                } 
                const newArticle= await postModel.findByIdAndUpdate(
                    id,
                {
                    "articleContent":data.articleContent,
                    "articlePhoto":data.articlePhoto,
                    "userName":data.userName,
                    "userPhoto":data.userPhoto,
                    "likes":data.likes
                },{
                    new:true
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
        
    }else if (req.url == '/posts' && req.method == "DELETE") {
        req.on('end', async()=>{
            try {
                const newArticle= await postModel.deleteMany({});
                const afterDelete = await postModel.find() 
                res.writeHead(200, headers); 
                res.write(JSON.stringify({
                  "status": "success",
                  "data": afterDelete
                }))
                res.end();
            } catch (error) {
                errorHandle(res,400,'新增貼文錯誤');
                return;
            }
        });       
    }else if (req.url.startsWith('/posts/') && req.method == "DELETE") {
        req.on('end', async()=>{
            try {
                const id = req.url.split('/').pop();
                const postCheckResult = await postModel.findById(id)
                if (!postCheckResult) {
                    errorHandle(res,400,'找不到此貼文');
                    return;
                }   
                
                const newArticle  = await postModel.findByIdAndDelete(id);
                const afterDelete = await postModel.find() ;
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                  "status": "success",
                  "data": afterDelete
                }))
                res.end();
            } catch (error) {
                errorHandle(res,400,'刪除貼文錯誤');
                return;
            }
        });
        
    }else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    }
    else{       
        errorHandle(res,404,'找不到路由');
        return;
    }

}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
