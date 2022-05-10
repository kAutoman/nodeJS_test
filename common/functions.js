const db = require("./database");
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const Common = {
    signUp : (req,res) => {
        let record = req.body;
        if (!record.email){
            return res.status(400).json('Email must be required.');
        }
        if (!record.password){
            return res.status(401).json('Password must be required');
        }
        if (!record.is_admin){
            record.is_admin = 0;
        }
        db.all(`SELECT count(*) as is_exist from user where email="${record.email}"`,[],(err,rows) => {
            if (err) {
                res.status(402).json({"error":err.message});
                return;
            }
            //if this email has already exists
            if (rows[0].is_exist > 0){
                return res.status(405).json({"error":"User already exists."});
            }
            else {
                let insert = 'INSERT INTO user (email, password, is_admin) VALUES (?,?,?)'
                db.run(insert, [record.email,md5(record.password),record.is_admin], (err , result) => {
                    return res.json('success');
                });
            }
        });
    },
    signIn : (req,res) => {
        let record = req.body;
        if (!record.email){
            return res.status(400).json('Email must be required.');
        }
        if (!record.password){
            return res.status(401).json('Password must be required');
        }
        if (!record.is_admin){
            record.is_admin = 0;
        }
        db.all(`SELECT * from user where email="${record.email}"`,[],(err,rows) => {
            if (err) {
                res.status(402).json(err.message);
                return;
            }
            //if this email has already exists
            if (!rows){
                return res.status(405).json("Email does not exists.");
            }
            else {
                //check password
                if (md5(record.password) === rows[0].password){
                    //login success & generate token.
                    const token = Common.generateAccessToken(rows[0]);
                    return res.json(token);
                }
                else {
                    //if password wrong
                    return res.status(406).json("Password wrong.");
                }

            }
        });
    },
    generateAccessToken : (record) => {
        const dotenv = require('dotenv');
        // get config vars
        dotenv.config();
        //expires in 1 days.
        return 'Bearer ' + jwt.sign(record, process.env.TOKEN_SECRET, { expiresIn: 60*60 });
    }
}
module.exports = Common;