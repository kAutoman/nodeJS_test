const express = require('express');
const morgan = require("morgan");
const jwt = require("jsonwebtoken");

const adminRouter = require('./routes/admin');
const customersRouter = require('./routes/customers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

/**
 * @author Hu Zhi Xing
 * @description auth middleware
 * @since 2022/05/10
* */
app.use((req, res, next) => {
    let needAuth = true;
    if(req.url.indexOf('signup') > -1){
        needAuth = false;
    }
    if(req.url.indexOf('signin') > -1){
        needAuth = false;
    }
    if (!needAuth){
        next();
        return;
    }
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user;
        //5.Create a middleware Authorization header that can determine if the client accessing the API is an admin or a user
        req.headers['is_admin'] = user.is_admin;
        next();
    });
})

app.use('/admin', adminRouter);
app.use('/customer', customersRouter);

//fallback
app.use('*',(req,res) => {
    res.status(404).send('no api exists.');
})

module.exports = app;
