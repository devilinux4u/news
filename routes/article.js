const express = require('express')
const router = express.Router()
const { info } = require('../db/sequelize');


router.get('/article/:nth/:id', async (req, res) => {
    try {
        let data = await info.findOne({
            where: { id: req.params.id }
        },
            {
                attributes: ['title', 'details', 'genre', 'description', 'img']
            }
        )
        
        res.render('article', { news: data });
    }
    catch (err) {
        console.log(err.message)
        res.send('Error in /article');
    }
})


module.exports = router;