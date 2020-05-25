var mysql      = require('mysql');
var moment = require('moment');
//moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
//var moment = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
var connection = mysql.createConnection({
  host     : '203.247.8.204',
  port     : '6000',
  user     : 'root',
  password : 'lab',
  database : 'smart_stethoscope'
});
connection.connect(function(error){
if(!error) {
    console.log("user is connected ... nn");
} else {
    console.log(error)
    console.log("Error connecting user database ... nn");
}
});

exports.checking_duplication = function(req,res){   // 아이디 중복검사 실시 후 가입 완료
  var idc = req.body.payload.user_id;
  connection.query('SELECT * FROM user WHERE user_id = ?',idc,
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
            "user_name":req.body.payload.user_name,
            "user_id":req.body.payload.user_id,
            "user_pw":req.body.payload.user_pw,
            "user_gender":req.body.payload.user_gender,
            "user_birth": req.body.payload.user_birth,            
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
                           "success":"user registered sucessfully"
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
   var user_id= req.body.payload.user_id;
   var user_pw = req.body.payload.user_pw;
   connection.query('SELECT * FROM user WHERE user_id = ?',[user_id], function (error, results, fields) {
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
       if(results[0].user_pw == user_pw){
         connection.query('SELECT USN, user_name FROM user WHERE user_id = ?',[user_id], function (error, results) {
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
