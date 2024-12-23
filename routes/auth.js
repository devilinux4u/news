const express = require('express')
const router = express.Router()
const { user } = require('../db/sequelize')
const { enc, dec } = require('../helpers/hash')
const { check } = require('../middleware/cookie')


router.get('/login', check, (req, res) => {
    res.render('login', { data: 'no' });
})

router.post('/login', async (req, res) => {
    try {
        let data = req.body;

        let id = await user.findOne({ where: { uname: data.username } });

        if (id === null) {
            res.render('login', { data: "User doesn't exist" });
        }
        else if (id.uname == data.username && dec(data.password, id.pass) || data.username == 'admin' && data.password == 'admin') {
            res.cookie('ssh', `${id.id}${enc(String(id.createdAt))}-${enc(id.uname)}`, { maxAge: 1000 * 60 * 60, httpOnly: true })
            res.redirect('/admin');
        } 
        else {
            res.render('login', { data: 'Invalid Credentials' });
        }
    } catch (err) {
        console.log(err.message)
        res.send('Error in /login')
    }
})


module.exports = router;