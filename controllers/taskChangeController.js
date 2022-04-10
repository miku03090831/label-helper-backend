var dbconfig = require('../util/DBConfig');
var fs = require("fs")
var xml2js = require("xml2js")
var archiver = require("archiver")
var md5 = require('js-md5');
const { type } = require('express/lib/response');
const res = require('express/lib/response');

var receiveTask = (req, res) => {
    let taskid = req.body.taskid;
    let receiver = req.body.rid;
    let sql = "update task set receiver=? , state=1 where taskid=?";
    let sqlArr_receive = [receiver, taskid];
    let callBack = (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else {
            res.send({
                state: true,
                message: "领取成功"
            })
        }
    }
    dbconfig.sqlConnect(sql, sqlArr_receive, callBack)
}

var finishTask = (req, res) => {
    let taskid = req.body.taskid;
    let receiver = req.body.rid;
    let sql = "update task set state=2 where taskid=? and receiver=?"
    let sqlArr_fin = [taskid, receiver];
    console.log("finish", sqlArr_fin)
    let callBack = (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else {
            res.send({
                state: true,
                message: "完成标注"
            })
        }
    }
    dbconfig.sqlConnect(sql, sqlArr_fin, callBack)
}

var createDataSet = (taskid, pjson, ljson) => {
    fs.mkdirSync(taskid.replace(/"/g, '_'));
    fs.mkdirSync(taskid.replace(/"/g, '_') + "/result")
    // console.log("什么类型",taskid.replace(/"/g,'*'));
    let sql = "select img from taskImg where taskid=?"
    let sqlPara = [taskid]
    let callBack = (err, data) => {
        if (err) {
            console.log(err)
        } else {
            let pdata = JSON.parse(pjson);
            let ldata = JSON.parse(ljson)
            for (let index in data) {
                let base64 = data[index].img;
                console.log("base64", typeof base64)
                let suffix = ".jpg";
                if (base64.startsWith("data:image/png"))
                    suffix = ".png"
                else if (base64.startsWith("data:image/jpg"))
                    suffix = ".jpg"
                let data64 = base64.replace(/^data:image\/\w+;base64,/, "");
                let dataBuffer = new Buffer(data64, 'base64');
                fname = md5(base64) + suffix;
                fs.writeFile(taskid.replace(/"/g, '_') + '/' + fname, dataBuffer, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("成功")
                    }
                })
                // console.log(JSON.parse(pjson));

                let p = JSON.parse(pdata[index]);
                let result = {
                    annotation: {
                        size: {},
                        segmented: { _: 0 },
                        object: []
                    }
                }
                if (true) {
                    fs.writeFile("test2" + index, p["objects"], err => {
                        if (err)
                            console.log(err);
                        else {
                            console.log("进来了写入成功")
                        }
                    })
                    let objects = p["objects"];
                    let offsetx, offsety
                    for (let i in objects) {
                        console.log('第几次',i);
                        if (i == 0) {
                            offsetx = objects[i].left;
                            offsety = objects[i].top;
                            result.annotation.size.width = { _: objects[i].width }
                            result.annotation.size.height = { _: objects[i].height }
                            result.annotation.size.depth = { _: 3 }
                        }
                        else {
                            let lid = objects[i].id;
                            let tagname = "未命名";
                            for (let tag of ldata[index]) {
                                if (tag.id == lid)
                                    tagname = tag.tag
                            }
                            result.annotation.object.push({
                                name: { _: tagname },
                                bndbox: {
                                    xmin: { _: objects[i].left - offsetx },
                                    ymin: { _: objects[i].top - offsety },
                                    xmax: { _: objects[i].left - offsetx + objects[i].width },
                                    ymax: { _: objects[i].top - offsety + objects[i].height }
                                }
                            })
                        }
                    }
                    let builder = new xml2js.Builder();
                    
                    let xml = builder.buildObject(result);
                    fs.writeFile(taskid.replace(/"/g, '_') + "/result/"+md5(base64)+".xml", xml.toString(), function (error) {
                        if (error) {
                            console.log('写入失败')
                        } else {
                            console.log('xml写入成功了')
                        }
                    })

                }
                fs.writeFile

                fs.writeFile("test" + index, JSON.parse(pjson)[index], err => {
                    if (err)
                        console.log(err);
                    else {
                        console.log("写入成功")
                    }
                })
                fs.writeFile("testl" + index, ljson, err => {
                    if (err)
                        console.log(err);
                    else {
                        console.log("写入成功")
                    }
                })
            }
            let output = fs.createWriteStream(taskid.replace(/"/g, '_') + '.zip');
            let archive = archiver('zip');
            archive.pipe(output);
            archive.directory(taskid.replace(/"/g, '_'), false);
            archive.finalize();
        }
    }
    dbconfig.sqlConnect(sql, sqlPara, callBack)
}

var storeResult = (req, res) => {
    let pjson = req.body.pjson;
    let ljson = req.body.ljson;
    let taskid = req.body.taskid;
    let sql = "insert into PicJson values(?,?,?)";
    let sqlArr_res = [taskid, pjson, ljson];
    let callBack = (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                state: false,
                message: err
            });
        } else {
            res.send({
                state: true,
                message: "保存成功"
            })
            createDataSet(taskid, pjson, ljson)
        }
    }
    dbconfig.sqlConnect(sql, sqlArr_res, callBack)
}


module.exports = {
    receiveTask,
    finishTask,
    storeResult
}