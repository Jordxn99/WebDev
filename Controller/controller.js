const express = require('express');
const controller = express.Router();

let DAOUser = require('../Model/users.js');
var dbFileUser = 'User.nedb.db';
let daoUser = new DAOUser(dbFileUser);

var milestones = 0 ; 
var sessionData;
var no = 0;
var module ;



controller.get("/", function(req, res) {
    res.render('login');
});

controller.get("/add", function(req, res) {
    res.render('add');
});

controller.get('/register', function(req, res) {
    res.render('register');
});

controller.get('/home', function(req, res) {
    no = 0;
    milestone = 0 ;
    findabetterway = null;
    
    var t = daoUser.searchByID(sessionData);
    t.then((entry) => {
        if (entry.username == null) {

        } else { 
            res.render('home', { "uname": entry.username ,
                                "ff" : entry.module });
        }
    })
});

controller.get('/add/milestones', function(req, res) {
    no++ ;
    res.render('milestoneAdd' , {'step' : no}) ; 
    
    
});

controller.get('/mod', function(req, res) {
    res.render('mod'); 
});






//TODO : NO DUPES
controller.post('/register', function(req, res) {
    const uname = req.body.uname;
    const pword = req.body.psw;
    const pwordR = req.body.pswR;
    const uni = req.body.unis;

    if (pword == pwordR) {
        daoUser.insertUser(uname, pword , uni);
        return res.redirect('/');
    }


    res.end();
});

controller.post('/', function(req, res) {
    const uname = req.body.uname;
    const pword = req.body.psw;
    var t = daoUser.searchByName(uname);

    t.then((entry) => {
            if (entry == null) {
                console.log("none there");
            } else {

                if (entry.passowrd == pword) {
                    sessionData = entry._id;
                    res.redirect('/home');
                } else {
                    console.log("Username or Password Wrong");
                    res.redirect('/');
                }
            }
        })
        .catch((err) => {
            console.log(err + "67");
            res.end();
        });


});

controller.post('/add', function(req, res) {
    var dueDate = req.body.dueDate;
    var moduleName = req.body.mName;
    var projectTitle = req.body.projectTitle ; 
    milestones = req.body.noOfMilestones ;
    findabetterway = Math.floor(Math.random() * 101) ;  
    module = {"moduleName" : moduleName , "dueDate" : dueDate , "milestones" : [] , "projectTitle" : projectTitle , "module_id" : findabetterway}; //TEMP

    res.redirect('/add/milestones');
      
    
        
})

controller.post('/add/milestones', function(req, res) {
    
    var desc = req.body.milestoneDesc;
    var milestoneID = Math.floor(Math.random() * 101) ; //TEMP
    var milestone = {"Desc" : desc , "completed" : false , "milestoneStep" : no ,"milestone_id" : milestoneID } ; 
    module.milestones[no - 1] = milestone ; 

    

    if( no < milestones){
    res.redirect('/add/milestones'); 
    }else {
        daoUser.updateModule(sessionData, module) ; 
        res.redirect('/home')}

})

controller.post('/del', function(req, res) {
    const module_id = req.body.id;
    daoUser.removeModule(sessionData , module_id) ;

    res.redirect('/home') ; 

});



module.exports = controller;