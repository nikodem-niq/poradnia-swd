function dodajUwage(uwaga){
    let uwagiTextBox = document.getElementById("uwagi")
    uwagiTextBox.value += uwaga
}

function countPoints(){
    let _pf1 = parseInt(document.getElementById("pff1").value);
    let _pf2 = parseInt(document.getElementById("pff2").value);
    let _pf3 = parseInt(document.getElementById("pff3").value);
    let _pf4 = parseInt(document.getElementById("pff4").value);
    let _pf5 = parseInt(document.getElementById("pff5").value);
    let _pf6 = parseInt(document.getElementById("pff6").value);
    let output = document.getElementById("output")
    let p = document.getElementById("wynikFigury")
    let points =  _pf1 + _pf2 + _pf3 + _pf4 + _pf5 + _pf6
    output.value = points
    let shapeSix = ""
      if(points >= 0 && points <= 5) {
      shapeSix = 'niski';
    } else if(points >=6 && points <= 9) {
      shapeSix = 'przeciętny';
    } else if(points >=10 && points <= 12) {
      shapeSix = 'wysoki';
    }
    p.innerHTML = "Wynik: " + shapeSix

}

function countAnaliza(){
    let p = document.getElementById("wynikAnaliza")
    let analiza = parseInt(document.getElementsByName("ana")[0].value);
    let _analiza = ""
    if(analiza < 1) {
        _analiza = "niski";
      }
      else if(analiza >= 1 && analiza < 7) {
        _analiza = "przeciętny";
      } 
      else if(analiza >= 7) {
        _analiza = "wysoki"
      }
      p.innerHTML = "Wynik: " + _analiza
}

function countSynteza(){
    // let sy1 = parseInt(document.getElementsByName("sy1")[0].value)
    // let sy2 = parseInt(document.getElementsByName("sy2")[0].value)
    // let sy3 = parseInt(document.getElementsByName("sy3")[0].value)
    // let sy4 = parseInt(document.getElementsByName("sy4")[0].value)
    // let sy5 = parseInt(document.getElementsByName("sy5")[0].value)
    // let sy6 = parseInt(document.getElementsByName("sy6")[0].value)
    // let sy7 = parseInt(document.getElementsByName("sy7")[0].value)
    // let sy8 = parseInt(document.getElementsByName("sy8")[0].value)
    let p = document.getElementById("wynikSynteza");
    let synteza = parseInt(document.getElementsByName("syn")[0].value);
    let _synteza = "";
    if(synteza < 1) {
        _synteza = "niski";
      } 
      else if( synteza >= 1 && synteza < 6) {
        _synteza = "przeciętny";
      } 
      else if(synteza >= 6) {
        _synteza = "wysoki"
      }
      p.innerHTML = "Wynik: " + _synteza
}

