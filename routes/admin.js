const express = require('express')
const router = express.Router()
const { check1 } = require('../middleware/cookie')
const { info } = require('../db/sequelize');


router.get('/admin', check1, async (req, res) => {
    try {
        let data = await info.findAll({
            attributes: ['id', 'title', 'details', 'genre', 'description', 'img'],
            order: [['id', 'DESC']]
        })

        res.render('admin', {news: data});
    }
    catch (err) {
        console.log(err.message)
        res.send('Error in /admin');
    }
})



module.exports = router;