const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const bodyParser = require("body-parser");
const cookiee = require('cookie-parser');

const main = require('./routes/main');
const article = require('./routes/article');
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const user = require('./routes/user');
 
app.use(cookiee());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./templates")));

app.use('/', main, article, auth, admin, user);

app.get('*', (req, res) => {
    res.render('error');
})

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});