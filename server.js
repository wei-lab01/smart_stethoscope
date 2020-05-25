const cors = require('cors');
var express = require("express");
var login = require('./routes/loginroutes');
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors());
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );


var router = express.Router();

router.post('/register', login.checking_duplication); //아이디 중복검사 및 회원 등록 
router.post('/login', login.login); //로그인
app.use('/api', router);
app.listen(3000);


// router.post('/register', login.register);
// router.post("/register", (req, res) => {
//     let params = req.body;
//     res.send("good");
//     login.register();
//     console.log(params);
//  });