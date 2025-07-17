const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function(req, res){
    fs.readdir(`./hisaab`, function(err,files){
        if(err) return res.status(500).send("Something went wrong while reading the directory");
        res.render("index" , { files: files });
//here files on the r.h.s is the array while the files on the l.h.s is the key in the object being passed to the ejs file template.
    })
})

app.get("/edit/:filename", function(req , res){
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send("Something went wrong while reading the file");
        res.render("edit" , {filedata , filename : req.params.filename});
    });
});
app.post("/update/:filename",function(req , res){
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content , function(err){
        if(err) return res.status(500).send("Something went wrong while updating the file");
        res.redirect("/"); //redirecting to the home page after updating the file
    })
})

app.get("/create",function(req,res){
    res.render("create");
})
app.post("/createhisaab", function(req,res){
    var curr = new Date();
    var date = `${curr.getDate()}-${curr.getMonth()+1}-${curr.getFullYear()}`; //here month start from 0 so we add 1 to it
    fs.writeFile(`./hisaab/${date}.txt`,req.body.content,function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/"); //redirecting to the home page after creating the file
    }); //yha ye req.body.title files ka name hai jinse hisaab folder mein file save hogi...
})

app.get("/hisaab/:filename",function(req,res){
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send("Something went wrong while reading the file");
        res.render("hisaab" , {filedata , filename : req.params.filename});
    })
})

app.get("/delete/:filename",function(req,res){
    fs.unlink(`./hisaab/${req.params.filename}`,function(err){
        if(err) return res.status(500).send("Something went wrong while deleting the file");
        res.redirect("/"); //redirecting to the home page after deleting the file
    })
})




app.listen(3000);