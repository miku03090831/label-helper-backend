var dbconfig = require('../util/DBConfig');

var getCertainPics = (req,res)=>{
    let taskid = req.body.taskid;
    let sql = "select img from taskImg where taskid=?"
    let sqlPara = [taskid]
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
                message:data
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlPara,callBack)
}

var getCertainTags = (req,res)=>{
    let taskid = req.body.taskid;
    let sql = "select tag from taskTag where taskid=?"
    let sqlPara = [taskid]
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
                message:data
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlPara,callBack)
}

var getCertainTask = (req,res)=>{
    let taskid = req.body.taskid;
    let sql = "select taskName from task where taskid=?"
    let sqlPara = [taskid]
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
                message:data
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlPara,callBack)
}

var getMyPubTaskList = (req,res)=>{
    let myid = req.body.myid;
    let sql = "select * from task where author=? and  state=2";
    let sqlPara = myid;
    let callBackWhole = (err,data)=>{
        if(err){
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else{
            res.send({
                state:true,
                message:data
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlPara,callBackWhole)
}

var getMyRecTaskList = (req,res)=>{
    let myid = req.body.myid;
    let sql = "select * from task where receiver=? and  state=1";
    let sqlPara = myid;
    let callBackWhole = (err,data)=>{
        if(err){
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else{
            res.send({
                state:true,
                message:data
            })
        }
    }
    dbconfig.sqlConnect(sql,sqlPara,callBackWhole)
}

var getTaskList = (req,res)=>{
    let sql = "select * from task where state=0";
    let callBackWhole = (err,data)=>{
        if(err){
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else{
            res.send({
                state:true,
                message:data
            })
        }
    }
    dbconfig.sqlConnect(sql,callBackWhole)
}
var getRes = (req,res)=>{
    console.log("在")
    console.log(req.query)
    let result ={path:req.query.id+".zip"} 
    // let result = {path:"_123456_1641413562513.rar"}
    res.download(result.path)
}
module.exports= {
    getTaskList,
    getCertainTask,
    getCertainTags,
    getCertainPics,
    getMyRecTaskList,
    getMyPubTaskList,
    getRes
}