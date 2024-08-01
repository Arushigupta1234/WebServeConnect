const express=require("express");
const app=express();//it returns object
const fileuploader=require("express-fileupload");
const mysql2=require("mysql2");

app.listen(3006,function(){
    console.log("Bale Bale:server started at port:3006"); 
});

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded(true));
var congObj={
    host:"127.0.0.1",
    user:"root",
    password:"arushi1234",
    database:"mainss",
    dateStrings:true
}
var mysql=mysql2.createConnection(congObj);

mysql.connect(function(err)
{
    if(err==null)
        console.log("Connected to database");
    else
        console.log(err.message);
})
app.get("/",function(req,resp){
   
    let filePath=process.cwd()+"/public/index.html";
    resp.sendFile(filePath);
})
//app.use(express.urlencoded({extended:true}));
app.use(fileuploader());

app.get("/user-save",function(req,resp)
{
   console.log(req.query);
    const email=req.query.x;
    const password=req.query.y;
    const Usertype=req.query.z;
      

    mysql.query("insert into users values(?,?,?,current_date(),1)",[email,password,Usertype],function(err)
    {
         if(err==null)
             resp.send("Record Saved Successfullyyy");
         else
             resp.send(err.message);
    })

})
app.post("/show-all",function(req,resp){
    mysql.query("select * from users",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
app.get("/check-email",function(req,resp)
    {
        var r=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      mysql.query("select * from users where emailid=?",[req.query.kuchEmail],function(err,resultJsonAry)
        {
            if(err==null)
        {
            if(resultJsonAry.length==1)
            {
                resp.send("Already exist.");
               // status=0;
            }
            else if(req.query.kuchEmail=="")
            {
                resp.send("Please enter an email id.");
            }
            else if(r.test(req.query.kuchEmail)==false)
            {
                resp.send("Email Invalid.");
            }
            else
                resp.send("Available...!!!");  
                //status=1;  
        }
        else
        resp.send(err);
    })
})

app.get("/get-address",function(req,resp)
    {
     //var r=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      mysql.query("select address,city from custprofile where emailid=?",[req.query.kuchEmail],function(err,resultJsonAry)
        {
            if(err==null)
        {
               resp.send(resultJsonAry);
               // status=0;
            
             
        }
        else
        resp.send(err);
    })
})




app.get("/checkk-login-email", function (req, resp) {
    const email = req.query.kuchhEmail;
    mysql.query(
      "SELECT * FROM users WHERE email_id = ?",
      [email],
      function (err, resultJsonAry) {
        if (err) {
          console.error(err);
          resp.status(500).send("Internal Server Error");
          return;
        }
        if (resultJsonAry.length === 1) {
          resp.send("&#9989;"); // Consider using plain text if not needed
        } else {
          resp.send("Account does not exist.");
        }
      }
    );
  });
  
  app.post("/checkk-login-info", function (req, resp) {
    const email = req.body.email;
    const password = req.body.password;
    
    mysql.query(
      "SELECT * FROM users WHERE email_id = ? AND password = ?",
      [email, password],
      function (err, resultJsonAry) {
        if (err) {
          console.error(err);
          resp.status(500).send("Internal Server Error");
          return;
        }
        if (resultJsonAry.length === 1) {
          if (resultJsonAry[0].status === 1) {
            const userType = resultJsonAry[0].utype;
            
            resp.send(userType);
          } else {
            resp.send("Your account is blocked! Contact Admin.");
          }
        } else {
          resp.send("Invalid email or password");
        }
      }
    );
  });

//----------------------Checking ------------------------------

app.get("/public/profile-customer.html",function(req,resp)
{
    resp.sendFile(process.cwd()+"/public/profile-customer.html");
})
//app.use(express.urlencoded({ extended: true }));

var setProfile= mysql2.createConnection(congObj);

 setProfile.connect(function(jasoos2)
 {
    if(jasoos2==null)
    {
        console.log("CONNECTION READY TO PROFILE SETTINGS!");
    }
    else
    {
        console.log(jasoos2);
    }
 })

//app.use(fileuploader());
app.post("/profile-save", function(req, resp) {
    console.log(req.body);
    // return;
    const email = req.body.email;
    const name = req.body.name;
    const contactNumber = req.body.cn;
    const address = req.body.add;
    const city = req.body.city;
    const state= req.body.states;
    
    let filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.ppic.name;
        req.files.ppic.mv(__dirname+"/public/uploads/"+filename);
    }
   

    mysql.query("INSERT INTO custprofile (emailId, Name, contactNumber, address, city,state,picname) VALUES (?, ?, ?, ?, ?,?,?)", 
    [email, name, contactNumber, address, city,state,filename], function(err) {
        if (err === null)
            resp.send("Record Saved Successfully");
        else
            resp.send(err.message);
    });
});

app.post("/show-all",function(req,resp){
    mysql.query("select * from custprofile",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})
//-------------------------------------------------------
app.post("/profile-update",function(req,resp)
{
    
    const email = req.body.email;
    const name = req.body.name;
    const contactNumber = req.body.cn;
    const address = req.body.add;
    const city = req.body.city;
    const state= req.body.states;

   
    let filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.ppic.name;
        req.files.ppic.mv(__dirname+"/public/uploads/"+filename);
    }

       req.body.ppic=filename;
       
       mysql.query("update custprofile set  Name=?, contactNumber=?, address=?,city=?, state=?, picname=? where emailId=?",[name, contactNumber,address,city,state,filename,email],function(err)
       {
            if(err==null)
                resp.send("Record Updated Successfullyyy");
            else
                resp.send(err.message);
       })

})



app.get("/fetch-one",function(req,resp)
{
    mysql.query("select * from custprofile where emailId=?",[req.query.kuchEmail],function(err,resultJsonAry){
        if(err==null)
            resp.send(resultJsonAry);
        else
        resp.send(err);
    })
})

app.get("/customer-dash",function(req,resp)
{
    resp.sendFile(process.cwd()+"/public/customer-dash.html");
})
app.get("/service-provider-dash",function(req,resp)
{
    resp.sendFile(process.cwd()+"/public/service-provider-dash.html");
})


//--------------------------------

app.get("/postJob-save",function(req,resp)
{
   console.log(req.query);
    const email=req.query.x;
    const taskCat=req.query.y;
    const address=req.query.z;
    const city=req.query.a;
    const upto=req.query.b;
    const work=req.query.c;
      

    mysql.query("INSERT INTO tasks (email, category, address, city, upto_date, task) VALUES (?, ?, ?, ?, ?, ?)", [email, taskCat, address, city, upto, work], function(err) {
        if (err == null)
            resp.send("Record Saved Successfullyyy");
        else
            resp.send(err.message);
    });
    
    

})



app.get("/fetchAdd", function (req, resp) {
    const email = req.query.email;

  
    mysql.query(
      "select * from custprofile where emailId=?",
      [email],
      function (err, arry) {
        if (err) {
          resp.send(err.message);
        } else {
          resp.send(arry);
        }
      }
    );
  });
  

app.post("/show-all",function(req,resp){
    mysql.query("select * from tasks",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})


app.post("/profile-update",function(req,resp)
{
    
    const email = req.body.email;
    const name = req.body.name;
    const contactNumber = req.body.cn;
    const address = req.body.add;
    const city = req.body.city;
    const state= req.body.states;

   
    let filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.ppic.name;
        req.files.ppic.mv(__dirname+"/public/uploads/"+filename);
    }

       req.body.ppic=filename;
       
       mysql.query("update custprofile set  Name=?, contactNumber=?, address=?,city=?, state=?, picname=? where emailId=?",[name, contactNumber,address,city,state,filename,email],function(err)
       {
            if(err==null)
                resp.send("Record Updated Successfullyyy");
            else
                resp.send(err.message);
       })

})


app.get("/changePwd",function(req,resp){
    var email=req.query.email;
    var opwd=req.query.opwd;
    var npwd=req.query.npwd;
    mysql.query("update users set password=? where email_id=? and password=?",[npwd,email,opwd],function(err){
      if(err==null){
          resp.send("Password Updated");
        }
      else{
        resp.send(err);
      }
    })
  })


  //----------------------------------------------


  app.get("/public/provider-profile.html",function(req,resp)
{
    resp.sendFile(process.cwd()+"/public/provider-profile.html");
})
//app.use(express.urlencoded({ extended: true }));

var setProfile= mysql2.createConnection(congObj);

 setProfile.connect(function(jasoos2)
 {
    if(jasoos2==null)
    {
        console.log("CONNECTION READY TO PROFILE SETTINGS!");
    }
    else
    {
        console.log(jasoos2);
    }
 })



  app.post("/pro-profile-save", function(req, resp) {
    console.log(req.body);
    // return;
    const email = req.body.emaiil;
    const name = req.body.namme;
    const contact= req.body.cnn;
    const gender = req.body.gender;
    const category = req.body.category;
    const firm = req.body.firm;
    const website= req.body.website;
    const location= req.body.address;
    const city= req.body.city;
    const since= req.body.since;
    const info= req.body.info;
    
    let filename="nopic.jpg";
    if(req.files!=null)
    {
        filename=req.files.ppicc.name;
        req.files.ppicc.mv(__dirname+"/public/uploads/"+filename);
    }
   

    mysql.query("INSERT INTO provider (emalId, Name,contactNumber, Gender, Category, Firm, Website, Address,City, Since, picname, Info) VALUES (?, ?, ?, ?, ?,?,?,?,?,?,?,?)", 
    [email, name, contact, gender, category, firm, website, location,city,since, filename,info], function(err) {
        if (err === null)
            resp.send("Record Saved Successfully");
        else
            resp.send(err.message);
    });
});

app.post("/show-alll",function(req,resp){
    mysql.query("select * from provider",function(err,resultJsonAry){
            resp.send(resultJsonAry);
    })
})



app.post("/profille-update", function(req, resp) {
    const email = req.body.emaiil;
    const name = req.body.namme;
    const contact = req.body.cnn;
    const gender = req.body.gender;
    const category = req.body.category;
    const firm = req.body.firm;
    const website = req.body.website;
    const location = req.body.address;
    const city= req.body.city;
    const since = req.body.since;
    const info = req.body.info;

    let filename = "nopic.jpg";
    if (req.files != null) {
        filename = req.files.ppicc.name;
        req.files.ppicc.mv(__dirname + "/public/uploads/" + filename);
    }

    mysql.query("UPDATE provider SET Name=?, contactNumber=?, Gender=?, Category=?, Firm=?, Website=?, Address=?,City=?, picname=?, Info=? WHERE emalId=?", 
        [name, contact, gender, category, firm, website, location,city, filename, info, email], 
        function(err, result) {
            if (err) {
                console.error("Error updating record:", err);
                resp.send("Error updating record: " + err.message);
            } else {
                console.log("Number of rows affected:", result.affectedRows);
                resp.send("Record Updated Successfully");
            }
        }
    );
});

app.get("/fetch-onee",function(req,resp)
{
    mysql.query("select * from provider where emalId=?",[req.query.kuchEmail],function(err,resultJsonAry){
        if(err==null)
            resp.send(resultJsonAry);
        else
        resp.send(err);
    })
})

app.get("/service-provider",function(req,resp)
{
    resp.sendFile(process.cwd()+"/public/service-provider-dash.html");
})




//------------------find job---------------

app.get("/fj", function (req, resp) {
    let filepath = process.cwd() + "/public/Find-job.html";
    resp.sendFile(filepath);
  });
  
  app.get("/angular-fetch-alljobs", function (req, resp) {
    mysql.query("select * from tasks", function (err, result) {
      if (err) {
        resp.send(err.message);
        return;
      } else resp.send(result);
    });
  });
  //-------------------------------------//
  //--------------Search service provider//////

  // app.get('/ssp', function (req, resp) {
  //   let filepath = path.join(process.cwd(), 'public', 'search--service--provider.html');
  //   resp.sendFile(filepath);
  // });
  
  
  // app.get('/angular-fetch-allserviproviders', function (req, resp) {
  //   mysql.query('SELECT * FROM provider', function (err, result) {
  //     if (err) {
  //       resp.status(500).send(err.message);
  //       return;
  //     }
  //     resp.send(result);
  //   });
  // });
  
  
  // app.get('/fetchcardbycityandsercat', function (req, resp) {
  //   const selectedCity = req.query.city;
  //   const selectedser = req.query.cat;
  
  //   mysql.query('SELECT * FROM provider WHERE City = ? AND Category = ?', [selectedCity, selectedser], function (err, result) {
  //     if (err) {
  //       resp.status(500).send(err.message);
  //       return;
  //     }
  //     resp.send(result);
  //   });
  // });
  
  
  // app.get('/getuniquecity', function (req, resp) {
  //   mysql.query('SELECT DISTINCT City FROM provider', function (err, result) {
  //     if (err) {
  //       resp.status(500).send(err.message);
  //       return;
  //     }
  //     resp.send(result);
  //   });
  // });
  
  
  // app.get('/getuniquesercat', function (req, resp) {
  //   const selectedCity = req.query.location;
  
  //   mysql.query('SELECT DISTINCT Category FROM provider WHERE City = ?', [selectedCity], function (err, result) {
  //     if (err) {
  //       resp.status(500).send(err.message);
  //       return;
  //     }
  //     resp.send(result);
  //   });
  // });
  const path = require('path');
  app.get('/ssp', function (req, resp) {
    let filepath = path.join(process.cwd(), 'public', 'search--service--provider.html');
    resp.sendFile(filepath);
  });
  
  
  app.get('/angular-fetch-allserviproviders', function (req, resp) {
    mysql.query('SELECT * FROM provider', function (err, result) {
      if (err) {
        resp.status(500).send(err.message);
        return;
      }
      resp.send(result);
    });
  });
  
  
  app.get('/fetchcardbycityandsercat', function (req, resp) {
    const selectedCity = req.query.city;
    const selectedser = req.query.cat;
  
    mysql.query('SELECT * FROM provider WHERE City = ? AND Category = ?', [selectedCity, selectedser], function (err, result) {
      if (err) {
        resp.status(500).send(err.message);
        return;
      }
      resp.send(result);
    });
  });
  
  
  app.get('/getuniquecity', function (req, resp) {
    mysql.query('SELECT DISTINCT City FROM provider', function (err, result) {
      if (err) {
        resp.status(500).send(err.message);
        return;
      }
      resp.send(result);
    });
  });
  
  
  app.get('/getuniquesercat', function (req, resp) {
    const selectedCity = req.query.location;
  
    mysql.query('SELECT DISTINCT Category FROM provider WHERE City = ?', [selectedCity], function (err, result) {
      if (err) {
        resp.status(500).send(err.message);
        return;
      }
      resp.send(result);
    });
  });


  //--------------------------------------------------------//



  app.get("/admin",function(req,resp){
   
    let filePath=process.cwd()+"/public/admin.html";
    resp.sendFile(filePath);
})



  app.get("/um", function (req, resp) {
    let filepath = process.cwd() + "/public/USER-manager.html";
    resp.sendFile(filepath);
  });

  app.get("/ap", function (req, resp) {
    let filepath = process.cwd() + "/public/All-providers.html";
    resp.sendFile(filepath);
  });
  app.get("/ac", function (req, resp) {
    let filepath = process.cwd() + "/public/ALL-customer.html";
    resp.sendFile(filepath);
  });



  app.get("/angular-fetch-all", function (req, resp) {
    mysql.query("select * from users", function (err, result) {
      if (err) {
        resp.send(err.message);
        return;
      } else resp.send(result);
    });
  });

  app.get("/block", function (req, resp) {
    const email = req.query.email;
    const sta = 0;
    // console.log(req.query.email);
  
    mysql.query(
      "select * from users where email_id=?",
      [email],
      function (err, result) {
        if (err) {
          resp.send(err.message);
  
          return;
        } else {
          const currentStatus = result[0].status;
  
          if (currentStatus === 0) {
            resp.send("ALREADY BLOCKED");
            // console.log("ALREADY BLOCKED");
            return;
          } else {
            mysql.query(
              "update users set status=? where email_id=? ",
              [sta, email],
              function (errr) {
                if (errr) resp.send(errr.message);
                else resp.send("User status updated successfully.");
              }
            );
          }
        }
      }
    );
  });


  app.get("/resume", function (req, resp) {
    const email = req.query.email;
    const sta = 1;
    // console.log(req.query.email);
  
    mysql.query(
      "select * from users where email_id=?",
      [email],
      function (err, result) {
        if (err) {
          resp.send(err.message);
  
          return;
        } else {
          const currentStatus = result[0].status;
  
          if (currentStatus === 1) {
            resp.send("ALREADY STATUS='1'");
  
            return;
          } else {
            mysql.query(
              "update users set status=? where email_id=? ",
              [sta, email],
              function (errr) {
                if (errr) resp.send(errr.message);
                else resp.send("User status updated successfully.");
              }
            );
          }
        }
      }
    );
  });

  app.get("/angular-fetch-allproviders", function (req, resp) {
    const user = "Provider";
    console.log(user);
    mysql.query(
      "select * from users where utype=?",
      [user],
      function (err, result) {
        if (err) {
          resp.send(err.message);
          return;
        } else resp.send(result);
      }
    );
  });





  app.get("/angular-fetch-allcustomer", function (req, resp) {
    const user = "Customer";
    console.log;
    mysql.query(
      "select * from users where utype=?",
      [user],
      function (err, result) {
        if (err) {
          resp.send(err.message);
          return;
        } else resp.send(result);
      }
    );
  });
  

  app.get("/angular-fetch-cusprofile", function (req, resp) {
    mysql.query("select * from custprofile", function (err, result) {
      if (err) {
        resp.send(err.message);
        return;
      } else resp.send(result);
    });
  });
  //------------------------------------//
  


  app.get("/jm",function(req,resp){
    let filepath=process.cwd()+"/public/JOB-manager.html";
    resp.sendFile(filepath);
  })
  
  app.get("/angular-fetch-allposttasks",function(req,resp){
  
    // console.log(req.query.email);
    mysql.query("select * from tasks where email=?",[req.query.email], function (err, result) {
      if (err) {
        resp.send(err.message);
        return;
      } else{ 
        console.log(result);
        resp.send(result);}
    });
  
  })
  
  app.get("/dodelete",function(req,resp){
    // console.log(req.query.id);
    mysql.query("delete from tasks where rid=?",[req.query.id], function (err, result) {
      if (err) {
        resp.send(err.message);
        return;
      } else{ 
        
        resp.send(result);}
    });
  })
  
  
  