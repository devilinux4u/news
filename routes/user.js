const express = require('express')
const router = express.Router()
const { user, info } = require('../db/sequelize');
const { enc, dec } = require('../helpers/hash');
const upload = require('../middleware/multer');
const { streamUpload } = require('../helpers/cloud');


router.get('/user/logout', (req, res) => {
    (req.cookies.ssh)
        ? res.clearCookie('ssh') && res.render('login', { data: 'no' })
        : res.render('login', { data: 'Session may have expired ...Login First' })
})

router.post('/user/paschange', async (req, res) => {
    try {
        if (req.cookies.ssh) {
            let id = await user.findOne({ where: { id: req.cookies.ssh.substring(0, 1) } });
            (id && dec(req.body.cpass, id.pass))
                ? await user.update({ pass: enc(req.body.npass) }, { where: { id: id.id } }) && res.send('password change success')
                : res.send('Current password didnt match while changing password')
        }
        else {
            res.render('login', { data: 'Error  while changing password !' })
        }
    }
    catch (err) {
        console.log(err.message)
        res.send('Error in /user/passchange');
    }
})

router.post('/user/upload', upload.single('thumbnail'), async (req, res) => {
    try {
        if (req.cookies.ssh) {
            let data = req.body;
            let result = await streamUpload(req.file.buffer);

            await info.create({
                title: data.title,
                details: data.det,
                genre: data.genre,
                description: data.des,
                img: result.url,
            }).then(
                res.redirect('/admin')
            )
        }
        else {
            res.render('login', { data: 'Error  while uploading news !' })
        }
    }
    catch (err) {
        console.log(err.message)
        res.send('Error in /user/upload');
    }
})

router.post('/user/delete/:id', async (req, res) => {
    try {
        if (req.cookies.ssh) {
            let id = req.params.id;

            await info.destroy({
                where: {
                    id: id
                }
            }).then(
                res.redirect('/admin')
            )
        }
        else {
            res.render('login', { data: 'Error  while deleting news !' })
        }
    }
    catch (err) {
        console.log(err.message)
        res.send('Error in /user/delete');
    }
})

router.post('/user/edit/:id', upload.single('uimg'), async (req, res) => {
    try {
        if (req.cookies.ssh) {
            let result;
            let data = req.body;

            (req.file)
                ?result = await streamUpload(req.file.buffer)
                :result =  await info.findOne({attributes: ['img']}, {where: {id: req.params.id}});

            await info.update({
                title: data.utitle,
                details: data.udet,
                genre: data.ugenre,
                description: data.udes,
                img: (req.file) ? result.url : result['dataValues']['img'],
            }, {
            where: {
                id: req.params.id
            }
        }).then(
            res.redirect('/admin')
        )
        }
        else {
    res.render('login', { data: 'Error  while updating news !' })
}
    }
    catch (err) {
    console.log(err.message)
    res.send('Error in /user/edit');
}
})




module.exports = router;