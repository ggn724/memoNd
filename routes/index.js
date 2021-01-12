var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// 유효성 검사 모듈 추가
const { check, validationResult } = require('express-validator');

// db 모듈 추가
const db = require('./../db');

// READ
router.get('/', function (req, res, next) {
  db.getAllMemos((rows) => {
    res.render('index', { rows: rows })
  });
});

// CREATE
router.get('/newMemo', function (req, res, next) {
  res.render('newMemo');
});

router.post('/store', [check('content').isByteLength({ min: 1, max: 500 })], function (req, res, next) {

  // 에러가 있으면 해당 에러내용을 반환 (value, msg, param, location)
  let errs = validationResult(req);   

  // 화면에 에러 출력
  if (errs['errors'].length > 0) {
    res.render('newMemo', { errs: errs['errors'] });
  } else {
    let param = JSON.parse(JSON.stringify(req.body));
    db.insertMemo(param['content'], () => {
      res.redirect('/');
    });
  };
});

// UPDATE
router.get('/updateMemo', (req, res) =>{
  let id = req.query.id;

  db.getMemoById(id, (row)=>{
    if(typeof id === 'undefined' || row.length <=0){
      res.status(404).json({error:'undefined memo'});
    }else{
      res.render('updateMemo', {row:row[0]});
    }
  });
});

router.post('/updateMemo', [check('content').isLength({min:1, max:500})], (req, res) =>{
  let errs = validationResult(req);

  let param = JSON.parse(JSON.stringify(req.body));
  let id = param['id'];
  let content = param['content'];

  if(errs['errors'].length > 0){ 
    //유효성 검사에 적합하지 않으면 정보를 다시 조회 후, updateMemo 페이지를 다시 랜더링
    db.getMemoById(id, (row)=>{ 
      res.render('updateMemo',{row:row[0], errs:errs['errors']});
    });
  }else{
    db.updateMemoById(id, content, () =>{
      res.redirect('/');
    });
  }
});

// DELETE
router.get('/deleteMemo', (req, res) =>{
  let id = req.query.id;
  db.deleteMemoById(id, () =>{
    db.resetById(()=>{
      res.redirect('/');
    });
  });
});

module.exports = router;