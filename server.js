const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const moment = require("moment");
const momentTimezone = require("moment-timezone");

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const multer  = require('multer');

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({secret : 'secret', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

MongoClient.connect("mongodb+srv://admin:qwer1234@cluster0.6lrvtzo.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("port2");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});


//메인페이지 get 요청
app.get("/",function(req,res){
  db.collection("brdlist").find({}).toArray(function(err,result){
    res.render("index",{brdData:result});
  });
});

//  /loginresult 경로 요청시 passport.autenticate() 함수구간이 아이디 비번 로그인 검증구간
passport.use(new LocalStrategy({
    usernameField: 'adminId',
    passwordField: 'adminPass',
    session: true,
    passReqToCallback: false,
  }, function (adminId, adminPass, done) {
    // console.log(userid, userpass);
    db.collection('user').findOne({ adminId: adminId }, function (err, result) {
      if (err) return done(err)
  
      if (!result) return done(null, false, { message: '존재하지않는 아이디 입니다.' })
      if (adminPass == result.adminPass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번이 틀렸습니다' })
      }
    })
  }));

    //처음 로그인 했을 시 해당 사용자의 아이디를 기반으로 세션을 생성함
  //  req.user
  passport.serializeUser(function (user, done) {
    done(null, user.adminId) //서버에다가 세션만들어줘 -> 사용자 웹브라우저에서는 쿠키를 만들어줘
  });
  
  // 로그인을 한 후 다른 페이지들을 접근할 시 생성된 세션에 있는 회원정보 데이터를 보내주는 처리
  // 그전에 데이터베이스 있는 아이디와 세션에 있는 회원정보중에 아이디랑 매칭되는지 찾아주는 작업
  passport.deserializeUser(function (adminId, done) {
      db.collection('user').findOne({adminId:adminId }, function (err,result) {
        done(null, result);
      })
  }); 


//파일첨부

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename : function(req, file, cb){
        cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') )
      }
    })
const upload = multer({ storage: storage })

//풍경화 메뉴 페이지
app.get("/menu/landscape",function(req,res){
  db.collection("prdlist").find({category:"풍경화"}).toArray(function(err,result){
    res.render("menu",{prdData:result});
  });
});

//정물화 메뉴 페이지
app.get("/menu/fixed",function(req,res){
  db.collection("prdlist").find({category:"정물화"}).toArray(function(err,result){
    res.render("menu",{prdData:result});
  });
});

//초상화 메뉴 페이지
app.get("/menu/portrait",function(req,res){
  db.collection("prdlist").find({category:"초상화"}).toArray(function(err,result){
    res.render("menu",{prdData:result});
  });
});

//갤러리 상세페이지
app.get("/menudetail/:no",function(req,res){
  db.collection("prdlist").findOne({num:Number(req.params.no)},function(err,result1){
    //전체 num 데이터 하나 꺼내오고
      db.collection("prdlist").find({category:result1.category}).toArray(function(err,result2){
          //prdlist 카테고리에 맞는 목록 꺼내오기
          res.render("menudetail",{prdData1:result1,userData:req.user,prdData2:result2});
      });
  });
});

//뉴스 상세페이지
app.get("/brddetail/:no",function(req,res){
  db.collection("brdlist").findOne({num:Number(req.params.no)},function(err,result){
    //전체 num 데이터 하나 꺼내오고
      res.render("brddetail",{brdData:result,userData:req.user});
  });
});

//아트스토리 페이지 
app.get("/story",function(req,res){
    res.render("story");
});

//사회적 기부 페이지 
app.get("/donaition",function(req,res){
  res.render("donaition");
});

//주요 작품 페이지 
app.get("/frame",function(req,res){
  db.collection("prdlist").find().toArray(function(err,result){
    res.render("frame",{prdData:result});
  });
});


//초현실주의 메뉴 페이지
app.get("/menu/surrealism",function(req,res){
  db.collection("prdlist").find({category:"초현실주의"}).toArray(function(err,result){
    res.render("menu",{prdData:result});
  });
});

//르네상스 메뉴 페이지
app.get("/menu/renaissance",function(req,res){
  db.collection("prdlist").find({category:"르네상스"}).toArray(function(err,result){
    res.render("menu",{prdData:result});
  });
});

//매장 검색 페이지(사용자)
app.get("/store",async function(req,res){
  //사용자가 게시판에 접속 시 몇번 페이징 번호로 접속했는지 체크
  let pageNumber = (req.query.page == null) ? 1 : Number(req.query.page);
  // 한 페이지당 보여줄 데이터 갯수
  let perPage = 2;
  // 한 블록당 보여줄 페이징 번호 갯수
  let blockCount = 3;
  // 현재 페이지 블록 구하기 
  let blockNum = Math.ceil(pageNumber / blockCount);
  //블록안에 있는 페이징의 시작번호값 알아내기
  let blockStart = ((blockNum - 1) * blockCount) + 1;
  //블록안에 있는 페이징의 끝번호값 알아내기
  let blockEnd = blockStart + blockCount - 1;
  //데이터 베이스 콜렉션에 있는 전체 객체의 갯수값 가져오는 명령어
  let totalData = await db.collection("storelist").countDocuments({});
  //전체 데이터 값을 통해서 몇개의 페이징 번호가 만들어져야 하는지
  let paging = Math.ceil(totalData / perPage);
  //만약 블록안에있는 페이징의 끝 번호값이 전체 페이징 갯수보다 많다면 강제로 마지막 페이징 번호값으로 변경
  if(blockEnd > paging){
      blockEnd = paging;
  }
  //블록의 총 갯수
  let totalBlock = Math.ceil(paging / blockCount);
  //데이터베이스에 실제 값을 꺼내기 위해 몇개씩 꺼내올건지 설정 sort / skip / limit
  let startFrom = (pageNumber - 1) * perPage
  db.collection("storelist").find({}).skip(startFrom).limit(perPage).toArray(function(err,result){
    res.render("store",{storeData:result,
                        paging:paging,
                        pageNumber:pageNumber,
                        blockStart:blockStart,
                        blockEnd:blockEnd,
                        blockNum:blockNum,
                        totalBlock:totalBlock
    });
  });
});

app.get("/storeopen",function(req,res){
  res.render("storeopen");
})

//주소로 검색시(사용자)
app.get("/store/search/local",function(req,res){
  // 시 / 도 선택시
  let pageNumber = "nopage";
  if(req.query.city1 !== "" && req.query.city2 === ""){
    db.collection("storelist").find({sido:req.query.city1}).toArray(function(err,result){
      res.render("store",{storeData:result,pageNumber:pageNumber});
    });
  }
  // 시/도 구/군 선택시
  else if(req.query.city1 !== "" && req.query.city2 !== ""){
    db.collection("storelist").find({sido:req.query.city1,sigugun:req.query.city2}).toArray(function(err,result){
      res.render("store",{storeData:result,pageNumber:pageNumber});
    });
  }
  // 아무것도 선택하지 않았을 때
  else{
    res.redirect("/store");
  }
});

//매장명으로 검색시 (사용자)
app.get("/store/search/storename",function(req,res){
  let pageNumber = "nopage";
  // query : <-- store.ejs 파일에서 input name 값
  // path: <-- db storelist 콜렉션에서 name 
  let storeSearch = [
    {
      $search: {
        index: 'store_search',
        text: {
          query: req.query.name,
          path: "name"
        }
      }
    }
  ]
  //검색어 입력시
  if(req.query.name !== ""){
    db.collection("storelist").aggregate(storeSearch).toArray(function(err,result){
      res.render("store",{storeData:result,pageNumber:pageNumber});
    });
  }
  //검색어 미입력시
  else{
    res.redirect("/store");
  }
});

//뉴스 (사용자) 화면 경로
app.get("/board",function(req,res){
  db.collection("brdlist").find({}).toArray(function(err,result){
    res.render("board",{brdData:result});
  });
});

//뉴스2 (사용자) 화면 경로
app.get("/board/news",function(req,res){
  db.collection("brdlist").find({}).toArray(function(err,result){
    res.render("news",{brdData:result});
  });
});




//관리자 로그인 페이지
app.get("/admin",function(req,res){
    res.render("admin_login");
});

//관리자 화면 로그인 유무 확인
app.post("/login",passport.authenticate('local', {failureRedirect : '/fail'}),function(req,res){
  res.redirect("/admin/prdlist");
  //로그인 성공 시 상품 등록 페이지로 이동
});

//로그인 실패시 fail 경로
app.get("/fail",function(req,res){
  res.send("로그인 실패");
});

//관리자 상품등록 페이지
app.get("/admin/prdlist",function(req,res){
  //db에 저장되어 있는 상품목록들 find로 찾아 와서 전송
  db.collection("prdlist").find({}).toArray(function(err,result){
    res.render("admin_prdlist",{prdData:result,userData:req.user});
  });
});

//상품을 db에 넣는 경로
app.post("/add/prdlist",upload.single('thumbnail'),function(req,res){
  //파일 첨부가 있을 때 
  if(req.file){
    fileTest = req.file.originalname;
  }
  //파일 첨부가 없을 때
  else{
    fileTest = null;
  }
  db.collection("count").findOne({name:"상품등록"},function(err,result1){
    db.collection("prdlist").insertOne({
      num:result1.prdCount + 1,
      name:req.body.name,
      conext:req.body.context,
      thumbnail:fileTest,
      category:req.body.category
    },function(err,result){
      db.collection("count").updateOne({name:"상품등록"},{$inc:{prdCount:1}},function(err,result){
        res.redirect("/admin/prdlist");
      });
    });
  });
});


//관리자 매장 등록 페이지 
app.get("/admin/storelist",function(req,res){
  //모든 매장리스트 데이터
  db.collection("storelist").find({}).toArray(function(err,result){
    res.render("admin_store",{storeData:result,userData:req.user});
  });
});

//매장등록
app.post("/addstore",function(req,res){
  db.collection("count").findOne({name:"매장등록"},function(err,result1){
    db.collection("storelist").insertOne({
      num:result1.storeCount + 1,
      name:req.body.name,
      sido:req.body.city1,
      sigugun:req.body.city2,
      adress:req.body.detail,
      phone:req.body.phone
    },function(err,result){
      db.collection("count").updateOne({name:"매장등록"},{$inc:{storeCount:1}},function(err,result){
        res.redirect("/admin/storelist");
      });
    });
  });
}); 

//관리자 뉴스등록 페이지
app.get("/admin/brdlist",function(req,res){
  //db에 저장되어 있는 상품목록들 find로 찾아 와서 전송
  db.collection("brdlist").find({}).toArray(function(err,result){
    res.render("admin_brdlist",{brdData:result,userData:req.user});
  });
});

//뉴스를 db에 넣는 경로
app.post("/add/brdlist",upload.single('thumbnail'),function(req,res){
  //파일 첨부가 있을 때 
  if(req.file){
    fileTest = req.file.originalname;
  }
  //파일 첨부가 없을 때
  else{
    fileTest = null;
  }
  db.collection("count").findOne({name:"뉴스등록"},function(err,result1){
    db.collection("brdlist").insertOne({
      num:result1.brdCount + 1,
      name:req.body.name,
      conext:req.body.context,
      thumbnail:fileTest,
      time:moment().tz("Asia/Seoul").format("YYYY-MM-DD")
    },function(err,result){
      db.collection("count").updateOne({name:"뉴스등록"},{$inc:{brdCount:1}},function(err,result){
        res.redirect("/admin/brdlist");
      });
    });
  });
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------
// 수정

//상품 업데이트
app.post("/upt/prdlist",upload.single('thumbnail'),function(req,res){
  //db에 수정된 데이터 업데이트
  //첨부파일을 했다면 해당 파일의 파일명
  if(req.file){
      fileUpload = req.file.originalname;
  }
  else{
      fileUpload = req.body.originfile;
  }

  db.collection("prdlist").updateOne({num:Number(req.body.id)},{
      $set:{
        name:req.body.name,
        conext:req.body.context,
        thumbnail:fileUpload,
        category:req.body.category   
      }
  },function(err,result){
      res.redirect("/admin/prdlist");
  });
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------------------
// 삭제


//상품 삭제 페이지
app.get("/prdlist/delete/:no",function(req,res){
  //db안에 데이터 삭제
  db.collection("prdlist").deleteOne({num:Number(req.params.no)},function(err,result){
      res.redirect("/admin/prdlist");
  });
});