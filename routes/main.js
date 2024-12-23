const express = require('express')
const router = express.Router()
const { info } = require('../db/sequelize');


router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = 10; 
        const offset = (page - 1) * limit;

        let data = await info.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'title', 'genre', 'description', 'img'],
            order: [['id', 'DESC']],
        });

        const totalPages = Math.ceil(data.count / limit);

        res.render('index', {
            news: data.rows,
            currentPage: page,
            totalPages: totalPages,
        })
    }
    catch (err) {
        console.log(err.message)
        res.send('Error in / (main)');
    }
})


module.exports = router;