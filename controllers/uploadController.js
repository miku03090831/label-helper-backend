var dbconfig = require('../util/DBConfig');

var storeImg = (req, res) => {

    // var form = new formdata.IncomingForm();
    // form.parse(req, function (err, fields, files) {
    //     for (item in files) {
    //         console.log(files[item])
    //     }
    // });
    let img = req.body.b64;
    let taskid = req.body.taskid
    let sql = "insert into taskImg value(?,?)";
    let sqlArr_img = [taskid,img]

    let callBack = (err,data)=>{
        if(err){
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else{
            res.send({
                state:true,
                message:taskid
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlArr_img,callBack)
}

var createTask = (req,res)=>{
    let taskid = req.body.taskid;
    let name = req.body.name;
    let author = req.body.author;
    let receiver = "0";
    let state=0;
    console.log("task中",req.body)
    let sql = "insert into task values(?,?,?,?,?)"
    let sqlArr_task = [taskid,name,author,receiver,state]
    let callBack = (err,data)=>{
        if(err){
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else{
            res.send({
                state:true,
                message:taskid
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlArr_task,callBack)
}
var createTag = (req,res)=>{
    console.log("tag中",req.body)
    let taskid = req.body.taskid;
    let tag = req.body.tag.value;
    let sql = "insert into taskTag values(?,?)";
    let sqlArr_tag = [taskid,tag];
    let callBack = (err,data)=>{
        if(err){
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else{
            res.send({
                state:true,
                message:taskid
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlArr_tag,callBack);
}

module.exports = {
    storeImg,
    createTask,
    createTag
}