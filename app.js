var express = require('express')
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();
var port = process.port || 3000;

app.use("/static", express.static(path.join(__dirname , `public`)));
app.use("/images", express.static(path.join(__dirname , `public`, `images`)));

app.use(logger('dev'));
app.set("view engine", "ejs");

app.use('/', indexRouter);


app.listen(port, ()=>{
  console.log(`App listenting on port: ${port}`);
})
