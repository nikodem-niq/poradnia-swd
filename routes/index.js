require('dotenv').config();

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const slugify = require('slugify');
const countAge = require('./../public/scripts/reportDate');
const pdf = require('html-pdf');
const fs = require('fs');
let Handlebars = require('handlebars');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies["userData"]) {
    if(req.query.sent == 'true') {
      res.render("report.pug", {sent:true});
    } else {
      res.render("report.pug", {sent:false});
    }
  } else {
    res.render('index.pug', { error: false });
  }
});

router.post('/report', (req,res,next) => {
  let date = req.body.date;
  let name = req.body.name;
  let age = countAge(date)
  if(countAge(date)[0] >= 7){
    res.render('age7.pug', {name: name, date:age});
  }else{
    res.render("age6.pug", {name:name, date:age});
  }
})

router.get('/logout', (req,res,next) => {
  if(req.cookies["userData"]) {
      res.clearCookie("userData");
      res.redirect('/');
  } else {
    res.redirect('/');
  }
})

router.post('/send', (req,res,next) => {
  let analiza = 0;
  analiza += parseInt(req.body.ana);

  let synteza = 0;

  synteza += parseInt(req.body.syn);

  let pamiecSluchowa = 0;
  if(req.body.zestaw1){ // tylko dla 7+ latkow
    pamiecSluchowa = 0;
    pamiecSluchowa += parseInt(req.body.zestaw1);
  }
  let artykulacja = req.body.artykulacja;
  let age = req.body.date;
  
  const parseData = () => {
    let _analiza;
    let _synteza;
    let _artykulacja;
    let _pamiecSluchowa;
    
    let years = age.slice(1).split(",")[0]

    if(years < 7){
      if(analiza < 1) {
        _analiza = "niski";
      }
      else if(analiza >= 1 && analiza < 7) {
        _analiza = "przeciętny";
      } 
      else if(analiza >= 7) {
        _analiza = "wysoki"
      }


      if(synteza < 1) {
        _synteza = "niski";
      } 
      else if( synteza >= 1 && synteza < 6) {
        _synteza = "przeciętny";
      } 
      else if(synteza >= 6) {
        _synteza = "wysoki"
      }

      _pamiecSluchowa = "nie dotyczy"
    }

    else if(years >= 7){
      if(analiza < 7) {
        _analiza = "niski";
      } 
      else if(analiza >= 7) {
        _analiza = "przeciętny";
      } 
      else if(analiza == -1) { // brak zakresu wysokiego dla 7 latkow
        _analiza = "wysoki"
      }

      if(synteza < 7) {
        _synteza = "niski";
      } 
      else if( synteza >= 7) {
        _synteza = "przeciętny";
      } 
      else if(synteza == -1) { // brak zakresu wysokiego dla 7 latkow
        _synteza = "wysoki"
      }

      if(pamiecSluchowa == -1){
        _pamiecSluchowa = "nieustalona"
      }
      if(pamiecSluchowa < 4 && pamiecSluchowa != -1){
        _pamiecSluchowa = "niski"
      }
      else if(pamiecSluchowa >= 4 && pamiecSluchowa < 10){
        _pamiecSluchowa = "przeciętny"
      }
      else if(pamiecSluchowa >= 10){
        _pamiecSluchowa = "wysoki"
      }
    }

// -------------- CZESC WSPÓLNA
    if(artykulacja == "0"){
      _artykulacja = "do konsultacji logopedycznej"
    }
    else if(artykulacja == "1"){
      _artykulacja = "wada wymowy"
    }
    else if(artykulacja == "2"){
      _artykulacja = "mowa prawidłowa"
    }

    return [_analiza,_synteza,_artykulacja,_pamiecSluchowa]
  }

  const shapesForSix = {
    s1 : req.body.pf1,
    s2 : req.body.pf2,
    s3 : req.body.pf3,
    s4 : req.body.pf4,
    s5 : req.body.pf5,
    s6 : req.body.pf6,
  }

  const valuesSix = Object.values(shapesForSix);
  const parsedToInt = valuesSix.map(el => parseInt(el));
  const reducedSix = parsedToInt.reduce((a,b) => a+b, 0)
  const shapeSixString = () => {
    let shapeSix;
    if(reducedSix >= 0 && reducedSix <= 5) {
      shapeSix = 'niski';
    } else if(reducedSix >=6 && reducedSix <= 9) {
      shapeSix = 'przeciętny';
    } else if(reducedSix >=10 && reducedSix <= 12) {
      shapeSix = 'wysoki';
    }
    return shapeSix;
  }

  const checkShapes = () => {
    let przerysowanieFigur = req.body.pf
    let _przerysowanieFigur;

    if(przerysowanieFigur <= 48){
      _przerysowanieFigur = "niski"
    }
    else if(przerysowanieFigur > 48 && przerysowanieFigur <= 66 ){
      _przerysowanieFigur = "przeciętny"
    }
    else if(przerysowanieFigur > 66){
      _przerysowanieFigur = "wysoki"
    }
    const checkAge = req.body.age == 'age6' ? shapeSixString() : _przerysowanieFigur;

    return checkAge;
  }

  const formatDate = () => {
    let date = req.body.date;
    let formatedDate_ = date.slice(1, -1);
    return formatedDate_;
  }

  const formData = {
    name : req.body.name,
    lat : req.body.lat,
    date : formatDate(),
    artykulacja: parseData()[2],
    analiza : parseData()[0],
    synteza : parseData()[1],
    pamiecSluchowa: parseData()[3],
    shapesSix : checkShapes(),
    uwagi: req.body.uwagi,
    mailTo : req.body.genreport 
  }

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS
    }
  })
  
  const handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: 'views/email',
      layoutsDir: 'views/email',
      defaultLayout: 'emailTemplate.hbs',
    },
    viewPath: 'views/email',
    extName: '.hbs',
  };
  
  let source = fs.readFileSync("views/email/emailTemplate.hbs", "utf8")
  let template = Handlebars.compile(source)
  let html = template({formData})

  pdfOptions = {
    "format": "A4",
    "orientation": "landscape",
    "border" : "0px"
  }

  function createPDF(){
    return new Promise(resolve =>{
        pdf.create(html, pdfOptions).toFile(`raporty/${slugify(formData.name)}.pdf`, function(err, res){resolve("resolved")});
    })

  }
  
  const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: 'nikodemniq@gmail.com',
      subject: "Badania Przesiewowe: " + formData.name,
      attachments: [{
        filename: `${slugify(formData.name)}.pdf`,
        path: `raporty/${slugify(formData.name)}.pdf`,
        contentType: 'application/pdf'
      }],
    };
    
  
  async function sendMail(){
    await createPDF()
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      res.redirect('/?sent=true');
    });   
  }
  sendMail();
});

module.exports = router;
