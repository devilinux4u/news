const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const sequelize = new Sequelize(config.db_con);

const model = require('./model');
const user = model.user(sequelize, DataTypes);
const info = model.info(sequelize, DataTypes);


(async () => {
    try {
        sequelize.sync();
        console.log('Database synced succefully');
        const userCount = await user.count();
        if (userCount === 0) {
            await user.create({ uname: 'admin', pass: 'admin' });
            console.log('Default admin user created with uname: admin and pass: admin');
        }
    } catch (error) {
        console.error('Unable to connect to the database:\n', error);
    }
})();


module.exports = {
    sequelize,
    user: user,
    info: info
}