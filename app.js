//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _=require("lodash");
const ejs = require("ejs");
const mongoose=require("mongoose");
var router = express.Router();
//mongoose.connect("mongodb://localhost:27017/Postdb", {useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect("mongodb+srv://admin-raj:raj123@cluster0-tkpkr.mongodb.net/Postdb",{useNewUrlParser:true,useUnifiedTopology:true});
const postsSchema={
  title:String,
  content:String
};
const Post=mongoose.model("Post",postsSchema);
const loginsSchema={
  Id:String,
  password:String,
  posts:[postsSchema]
}
const Login=mongoose.model("Login",loginsSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

//app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/home",function(req,res){
  var id=req.body.id;
  //res.render("singup");

  Login.findOne({Id:id},function(err,f){
    if(!err)

    {if(f){
      res.render("home",{sing:id,startingContent: homeStartingContent,

      posts: f.posts});}
    }
    else {
      console.log("not find");
    }
  });
});

//});
app.post("/home",function(req,res){

});//});

app.post("/delete",function(req,res){
  const sing=req.body.publish;
  res.render("compose",{"sing":sing});
});
app.get("/about",function(req,res){
  res.render("about",{content:aboutContent});
});
app.get("/contact",function(req,res){
  res.render("contact",{content:contactContent});
});
app.get("/compose",function(req,res){
  res.render("compose");

});
app.get("/",function(req,res){
  res.render("login");
});
app.get("/singup",function(req,res){
res.render("singup");
});
app.get('/post/:postsId', function (req, res) {
  const reqid=(req.params.postsId);
//  const id=(req.params.singid);

  //console.log(id);
//  Login.findOne({_id:reqid},function(err,p)
  //{ if(p)
    // {res.render("post",{title:p.title,postbody:p.content});}
 //else {
   //console.log("not found");
 //}}
//);

//  for(var i=0;i<title.length;i++)
  //{const storeid=_.lowerCase(title[i]);
    //if(storeid===reqid)
    //{
    //res.render("post",{title:title[i],postbody:body[i]});

    //}

  //}
  Login.findOne(  { 'posts._id': reqid } ,function(err,p){
    if(!err&&p)
    {console.log(reqid);
    //  console.log(p.id);
      res.render("post",{title:p.title,postbody:p.content});}
  } );
  //Login.findOne({_id:id},function(err,f)
//{
  //if(f)
  //{
    //f.posts.findOne({_id:reqid},function(err,p){
      //{ if(p)
        // {res.render("post",{title:p.title,postbody:p.content});}
     //else {
       //console.log("not found");
     //}}
   //});
  //}
  //else {
    //console.log("f not found");
  //}
//})

});
app.post("/compose",function(req,res){
 var sing=req.body.sing;
 var b=req.body.postbody;
  var  t=req.body.Posttitle;
  const post=new Post({
    title:t,
    content:b
  });
Login.findOneAndUpdate({Id: sing}, {$push: {posts: post}},function(err,result){
    if(!err&&result)
    {console.log("updated");
  res.render("home",{"sing":sing,startingContent:homeStartingContent,posts:result.posts})}

});
});

app.post("/",function(req,res){
  var log=req.body.Id;
  var pass=req.body.password;
  const login= new Login({
    Id:log,
  password:pass
  });
  login.save();
  res.redirect("singup");
});
app.post("/singup",function(req,res){
  var sing=req.body.SId;
  var spass=req.body.Spassword;
  Login.findOne({Id:sing,password:spass},function(err,result){
    if(!err&&result)
    {res.render("home",{"sing":sing,"startingContent": homeStartingContent,"posts":result.posts});}

  else {
  console.log("wrongpassword");
  }
});
});
let port=process.env.PORT;
if(port==null || port =="")
{
  port=3000;
}
app.listen(port,function(){
  console.log(port);
  console.log("server is started");
});
//app.listen(3000, function() {
  //console.log("Server started on port 3000");
//});
