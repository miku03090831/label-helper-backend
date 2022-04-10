var dbconfig = require('../util/DBConfig');
const jwt = require('jsonwebtoken');


var UserLogin = (req,res)=>{
    let email=req.body.account;
    let password = req.body.password;
    
    let sql = 'select * from user where email=? and password=?';
    let sqlArr = [email,password];
    let callBack = (err, data) => {
        if (err) {
            res.send({
                state: false,
                message: err
            });
        } else {
            if (data.length) {
                jwt.sign({username:data[0].username},"mqh123",{ expiresIn: 60*60 }, (err, token) => {
                    if (err) throw err;
                    console.log("创造token",token)
                    res.send({
                        state: true,
                        token: token,
                        username:data[0].username
                    })
                })

                
                // res.send({
                //     state: true,
                //     username: data[0].username,
                // })
            } else {
                res.send({
                    state: false,
                    message: "账号或密码错误"
                })
            }
        }
    }
    console.log('in UserLogin...');
    dbconfig.sqlConnect(sql, sqlArr, callBack);

}


var UserRegister = (req,res) =>{
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    let sql_check = 'select * from user where email=? or username=?';
    let sqlArr_check = [email,username];
    let sql_insert = 'insert into user value(?,?,?)';
    let sqlArr_insert = [email,username,password];

    let callBackRegister = (err_reg, data_reg) => {
        console.log('in UserRegister_Register...');
        if (err_reg) {
            res.send({
                state: false,
                message: err_reg
            });
        } else {
            res.send({
                state: true,
                message: "注册成功"
            })
        }
    }
    
    let callBackCheck = (err_check, data_check) => {
        console.log('in UserRegister_check...',data_check);
        if (err_check) {
            res.send({
                state: false,
                message: err_check
            });
        } else {
            if (data_check.length) {
                checkregisterflag = true;
                res.send({
                    state: false,
                    message: "邮箱或用户名已被使用"
                })
            } else {
                checkregisterflag = false;
            }

            if (checkregisterflag) {
                return;
            } else {
                dbconfig.sqlConnect(sql_insert, sqlArr_insert, callBackRegister);
            }
        }
    }

    console.log('in UserRegister...');
    dbconfig.sqlConnect(sql_check, sqlArr_check, callBackCheck);
}

module.exports = {
    UserLogin,
    UserRegister
}