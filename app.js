const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const shortid = require('shortid')

var todos = []
var complete = []

app.engine('mustache', mustacheExpress());
// where the mustache file is stored
app.set('views', './views')
app.set('view engine', 'mustache')
//bodyParser takes info from ___ and makes it readable upon 'req'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'static')))
//1. grab localhost, render html
// 3. information from 'text' body is resulting with a rendered response and pushing it to the mustache file.
app.get("/", function(req, res, next){
  res.render("index", {todos:todos, complete:complete})
})

//2. post in the information coming from the submit and text. Then, we push the information from the 'text' body to the todos array. Next we are redirected to app.get
app.post("/", function(req, res, next){
  todos.push({            ///object is created inside array so an id can generate for each item
    id: shortid.generate(),  
    text: req.body.text /// requesting the text within the body of html inout that is entered by user
  })
  console.log(todos)
  res.redirect('/')
})

app.post ("/complete", function(req,res,next){   ///4. new route must be created for any tasks that have an id. Id is passed under '/complete' form in mustache when button 'mark as complete' is submited.
  const id = req.body.id  // variable 'id' is requesting the id (generated from user text input) within the body of mustache. 
  const completeTodo = todos.filter (function(item){  ///a new variable, completeTodo is created to push the filtered items in the todo array. the filter can find either 'id' or 'text'. in this case, we are looking for 'id'
    return item.id === id  /// when filtering through todo list, we want to pull the 'id' part of the todo array. we do this with item.id
  })[0]                     /// if the item.id from the filter within todos array is equal to the id generated from user input, then it is pushed into an empty array (filter always returns an array). this empty array is const completeTodo
                         
complete.push(completeTodo) /// the indexed items are now pushed into complete array
todos = todos.filter(function(item){  // if the items in the todo list are not selected, the generated 'id' is not passed. thus, the todo id will not equal a generated id, because its not there.
    return item.id !== id
  })

  res.redirect("/")  /// need to redirect back to '/' to view changes. without redirect, the info is held with nowhere to go
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})