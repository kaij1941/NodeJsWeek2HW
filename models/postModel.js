const mongoose = require('mongoose');
const postSchema =new mongoose.Schema({
    articleContent:{
        type:String,
        required:[true,'貼文內容未填寫']
    },
    articlePhoto:{
        type:String,
    },
    userName:{
        type:String,
        requird:[true,'貼文者名稱未填寫']
    },
    userPhoto:{
        type:String,
        requird:[true,'貼文者照片未填寫']
    },
    likes:{
        type:Number,
        requird:[true,'按讚數為必填,至少為零']
    },
    creatTime:{
        type:Date,
        default:Date.now,
        select:false
    }
},
{
  versionKey: false
})


const postModel = mongoose.model('post',postSchema);

module.exports = postModel;
