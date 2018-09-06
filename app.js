var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socketio = require("socket.io");
var products = require("./product");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// 리스너 작성
var onConnection = function (socket) {
  
  // 함수를 선언
  function onReturn(index) {
    if (cart[index]) {
      // 물건 개수 증가
      products[index].count++;
  
      // 타이머를 제거
      clearTimeout(cart[index].timeID);
  
      // 카트에서 물건을 제거
      delete cart[index];
      
      // return 이벤트를 발생
      socket.emit("return", {
        index: index
      });
    }
    
    // count 이벤트를 발생
    app.io.sockets.emit("count", {
      index: index,
      count: products[index].count,
    });
  }

  //변수 선언
  var cart = {};

  // cart 이벤트
  socket.on("cart", function (index) {
    if (products[index].count < 1) {
      // cart 이벤트 발생
      socket.emit("cart", {
        index: index,
        status: false,
      });
    } 
    else {
      // 물건 개수 감소
      products[index].count--;
  
      // 카트에 물건을 넣고 타이머를 시작
      cart[index] = {};
      cart[index].index = index;
      cart[index].dueTime = Date.now() + 10 * 1000; // 소멸시각을 Milliseconds로 프로퍼티에 저장
      cart[index].timeID = setTimeout( function () {
        onReturn(index);
      }, 10  * 1000);
      
      // cart 이벤트 발생
      socket.emit("cart", {
        index: index,
        status: true,
        dueTime: cart[index].dueTime,
      });
  
      // count 이벤트 발생
      app.io.sockets.emit("count", {
        index: index,
        count: products[index].count,
      });
    }
  });

  socket.on("buy", function (index) {
    // 카트 물건이 존재하는지 확인 후 구매 요청 처리
    if (!cart[index]) {
      socket.emit("ordered", {
        index: index,
        status: false,
      });
    } else {
      // 타이머 제거
      clearTimeout(cart[index].timeID);
  
      // 카트에서 물건을 제거
      delete cart[index];
  
      socket.emit("ordered", {
        index: index,
        status: true,
      });
    }

    // count 이벤트를 발생
    app.io.sockets.emit("count", {
      index: index,
      count: products[index].count,
    });
  });

  socket.on("return", function (index) {
    onReturn(index);
  });
};

// 웹 서버 생성
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// 소켓 서버 생성 및 이벤트 리스너 연결
app.io = socketio();
app.io.on("connect", onConnection);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
