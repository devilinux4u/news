const { user } = require('../db/sequelize');
const { dec } = require('../helpers/hash');

module.exports.check = (req, res, next) => {
    (req.cookies.ssh)
        ? res.redirect('admin')
        : next();
}

module.exports.check1 = async (req, res, next) => {
    if (req.cookies.ssh) {
        let cok = req.cookies.ssh.split('-');

        try {
            let id = await user.findOne({ where: { id: cok[0].substring(0, 1) } });

            (id && dec(String(id.createdAt), cok[0].substring(1)) && dec(id.uname, cok[1]))
                ? next()
                : res.render('login', { data: "User doesn't exist" });

        } catch (err) {
            console.log(err.message)
            res.send('error admin validation')
        }
    }
    else {
        res.render('login', { data: 'Session may have expired ...Login First' })
    }


}


