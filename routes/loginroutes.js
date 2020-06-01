var mysql      = require('mysql');
var moment = require('moment');
//moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
//var moment = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var connection = mysql.createConnection({
  host     : '203.247.8.204',
  port     : '6000',
  user     : 'root',
  password : 'lab',
  database : 'lab_server'
});
connection.connect(function(error){
if(!error) {
    console.log("database user is connected ... nn");
} else {
    console.log(error)
    console.log("Error connecting user database ... nn");
}
});

exports.checking_duplication = function(req,res){   // 아이디 중복검사 실시 후 가입 완료
  var userID = req.body.map.userID;
  connection.query('SELECT * FROM user WHERE userID = ?',userID,
    function(error, results){
      if (error){
        console.log(error);
      }
      else{
        if(results.length > 0){
          console.log("error ocurred",error);
          res.send({
            "code":201,
            "fail":"not available"
          });         
            }
        else{ 
          var user={
            "userID":req.body.map.userID,
            "userPassword":req.body.map.userPassword,
            "userName":req.body.map.userName,
            "userAge":req.body.map.userAge,
            "timestamp": moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
          }
          connection.query('INSERT INTO user SET ?',user, function (error, results) {
            if (error) {
              console.log("error ocurred",error);
              res.send({
                "code":400,
                "failed":"error ocurred"
              });
            }else{
              connection.query(`SELECT MAX(USN) as USN FROM user`, 
                  function (error, USN) {
                    if(error) {return console.error(error);}
                    else{                      
                      console.log(results)
                      res.send({
                           "code":200,
                           "success":"성공"
                          });
                   }   
                });
             }
          });
        }
      }
    }
  )
}


exports.login = function(req,res){
   var userID= req.body.map.userID;
   var userPassword = req.body.map.userPassword;
   connection.query('SELECT * FROM user WHERE userID = ?',[userID], function (error, results, fields) {
   if (error) {
     // console.log("error ocurred",error);
     res.send({
       "code":400,
       "failed":"error ocurred"
     });
   }
   else{
     // console.log('The solution is: ', results);
     if(results.length >0){
       if(results[0].userPassword == userPassword){
         connection.query('SELECT USN, userName FROM user WHERE userID = ?',[userID], function (error, results) {
          if (error) {
            // console.log("error ocurred",error);
            res.send({
              "code":400,
              "failed":"error ocurred"
            });
          }
          else{
            USN = results
            res.send({
              "code":200,
              "USN" : USN
                });

         }
        });
      }
        else{
         res.send({
           "code":204,
           "success":"id and password does not match"
             });
       }
     }
     else{
       res.send({
         "code":204,
         "success":"id does not exits"
           });
     }
   }
   });
 }
