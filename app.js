var express = require('express');
var http = require('http');
var path = require('path');
 
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
 
var port = 3000;

// upgrade http server to socket.io server
var io = require('socket.io').listen(app.listen(process.env.PORT || port++, function() {
  console.log('Socket IO server has been started');
})
);

var i=1;
 
io.sockets.on('connection',function(socket){
  console.log('connect!'+i);
  var welcome = "Welcome, user"+i;
  var join = "user"+i+" joined";
  var bye = "bye, user"+i+"!";
  i++;
   socket.emit('toclient',{msg:welcome});
   socket.broadcast.emit('toclient',{msg:join});
   socket.on('fromclient',function(data){
       socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
       socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
       console.log('Message from client :'+data.msg);
   });
   socket.on('disconnect', function() {
    socket.broadcast.emit('toclient',{msg:bye});
     console.log('disconnect!'+i);
     i--;
   })
});


