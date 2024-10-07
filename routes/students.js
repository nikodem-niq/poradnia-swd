import express from 'express';
import { generateFile } from '../services/pdf.js';
import { countAge } from '../services/ageCalculator.js';
import { delAllFilesByUserId, delFileByUrl } from '../db/blob.js';

const router = express.Router();

router.post('/add', async (req, res) => {
    try {

        if(req.cookies["userData"]) {
          const userId = req.cookies["userData"][1];
          const formData = processFormData(req.body);
          await generateFile(formData, userId);
          res.redirect('/');
        } else {
          res.redirect('/');
        }
    }
    catch(error) {
        console.error(error);
    }
});

router.get('/delete', async (req, res) => {
  if(req.cookies["userData"]) {
    await delFileByUrl(req.query.delete);
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

router.get('/delete-all', async (req, res) => {
  if(req.cookies["userData"]) {
    const userId = req.cookies["userData"][1];
    await delAllFilesByUserId(userId)
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

function processFormData(body) {
    let analiza = 0;
  analiza += parseInt(body.ana);

  let synteza = 0;

  synteza += parseInt(body.syn);

  let pamiecSluchowa = 0;
  if(body.zestaw1){ // tylko dla 7+ latkow
    pamiecSluchowa = 0;
    pamiecSluchowa += parseInt(body.zestaw1);
  }
  let artykulacja = body.artykulacja;
  let age = body.date;
  

  const parseData = () => {
    let _analiza;
    let _synteza;
    let _artykulacja;
    let _pamiecSluchowa;
    
    let years = countAge(age)[0]

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
    s1 : body.pf1,
    s2 : body.pf2,
    s3 : body.pf3,
    s4 : body.pf4,
    s5 : body.pf5,
    s6 : body.pf6,
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
    let przerysowanieFigur = body.pf
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
    const checkAge = body.age == 'age6' ? shapeSixString() : _przerysowanieFigur;

    return checkAge;
  }

  const formatDate = () => {
    let date = body.date;
    let years = `${countAge(date)[0]},${countAge(date)[1]}`
    return years;
  }

  const formData = {
    name : body.name,
    lat : body.lat,
    date : formatDate(),
    artykulacja: parseData()[2],
    analiza : parseData()[0],
    synteza : parseData()[1],
    pamiecSluchowa: parseData()[3],
    shapesSix : checkShapes(),
    uwagi: body.uwagi,
    mailTo : body.genreport 
  }

  return formData;
}

export default router;