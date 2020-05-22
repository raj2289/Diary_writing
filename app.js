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

const homeStartingContent = "Apple wants a weekend or expensive dui want to decorate. Which is always the creator nor the duration of her life. Carrots carrots just been running a lot. Product lived in this. Financing yeast rice vegetarian or clinical portal. That they are not members, nor members of the Donec ultrices tincidunt arcu. A lot of television targeted at the undergraduate nutrition. Of life, and the mountains shall be born, ultricies quis, congue in magnis dis parturient. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. The founder of basketball and football propaganda graduated drink at the arc. Performance skirt smile at any hate for hate vulputate. Running a lot of television targeted at the undergraduate kids. "
const aboutContent = "refinancing manufacturing CNN is beating. Dictumst manufacturing Textile for kids elit. There diameter boat manufacturing lorem yet. The street dictum everyone bows pure. Want yet, but the smile worth more than Vulputate soccer massage. Moors into a salad ecological . always smile at each Bureau does not relax clinical pregnant makeup. Currently mass of temperature or peanut sauce Westinghouse. for example, to earth element arrows of life. basketball largest peanut running into the ugly mass developers worth it.";
const contactContent = "Thermal deductible until the price vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Inspections Ut et drink recipes. Minneapolis developer undergraduate homework et. Laughter pull undergraduate at iaculis in the region. Nor do some shooting movies malesuada bibendum sapien arcu vitae. Recipe sometimes varied mainstream real estate. But now targeted propaganda opportunities. Sometimes put lorem ipsum carrots undergraduate tomato soup. The cushion element of the whole, they shall neither. Basketball was pregnant dark to invest clinical zero. So that the disease in the aliquam sem mauris fringilla tincidunt. Set the temperature to photography always pull for free.";

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
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
app.get("/wpass",function(req,res){
  res.render("wpass");
});
app.get("/singupf",function(req,res){
  res.render("singupf");
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
  //res.render("home",{"sing":log,startingContent:homeStartingContent})
  res.redirect("singup");
});
app.post("/singup",function(req,res){
  var sing=req.body.SId;
  var spass=req.body.Spassword;
  Login.findOne({Id:sing},function(err,result){
    if(!err)
    { if(result)
     {  if(result.password===spass)
      res.render("home",{"sing":sing,"startingContent": homeStartingContent,"posts":result.posts});
     else{ console.log("wrong password.");
       res.redirect("wpass");
     }
   }
   else {
     console.log("sing up first.");
      res.redirect("singupf")
   }
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
