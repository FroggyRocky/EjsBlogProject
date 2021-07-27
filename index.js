const express = require("express");
const parser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose")
const app = express();
app.use(parser.urlencoded({extended: true}));
app.use(express.static(__dirname)); 
app.set("view-engine", "ejs");



mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});




const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
// ARRAY WITH BLOG'S POSTS

// const posts = [];

const postsSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
})

const postsCollection = mongoose.model("post", postsSchema)



//routes 

app.get("/posts/:parameter", function (req, res) {

    postsCollection.find({},(err, foundItems)=> {
       foundItems.forEach( (item) => {
    const title = _.lowerCase(item.title) 
    const apiTitle = _.lowerCase(req.params.parameter) 
     if (apiTitle == title ) {
            res.render("post.ejs", 
            { postTitle: item.title, postContent: item.text });
        } else { console.log("match is not found")}
     
    })

});

})


app.get("/", function(req,res){


postsCollection.find({}, (err,foundItems)=> {
if(foundItems.length == 0) {
    const defaultOption = new postsCollection({
        title:"Home",
        text:"Welcome to the Blog"
    })
 postsCollection.create(defaultOption, (err)=> console.log(err));
} else {
    res.render("home.ejs", {tPost:foundItems})
}

})

})

app.get("/about", (req, res) => {
res.render("about.ejs", {text:aboutContent, title:"About Us"})
})

app.get("/contact", (req,res) => {
res.render("contact.ejs", {text:contactContent, title:"Contact Us"})
})

app.get("/compose", (req,res) => {
res.render("compose.ejs", {title:"Compose"})
})

app.post("/compose", (req,res)=> {

const titleItem = req.body.postTitle;
const textItem =  req.body.postText;

const newItem = new postsCollection({
    title:titleItem,
    text:textItem 
})

postsCollection.find({title:titleItem}, (foundItem)=>{
    if (!foundItem) {
        newItem.save();
        res.redirect("/");
    } else {
        console.log("item already exists")
        res.redirect("/")
    }
})

})

app.listen(3002, () => {
console.log("server is running on " + 3002);
})


