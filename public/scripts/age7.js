let As = document.getElementsByClassName("A")
let Bs = document.getElementsByClassName("B")
let Cs = document.getElementsByClassName("C")
let Ds = document.getElementsByClassName("D")
function countPoints(){
    let podsumaA = document.getElementById("podsumaA")
    let podsumaB = document.getElementById("podsumaB")
    let podsumaC = document.getElementById("podsumaC")
    let podsumaD = document.getElementById("podsumaD")
    let suma = document.getElementById("sum")
    let p = document.getElementById("wynikFigury")
    
    let ASum = 0;
    let BSum = 0;
    let CSum = 0;
    let DSum = 0;
    for (let i = 0; i < As.length; i++) {
        ASum += parseInt(As[i].value);
        BSum += parseInt(Bs[i].value);
        CSum += parseInt(Cs[i].value);
        DSum += parseInt(Ds[i].value);
    }
    podsumaA.value = ASum
    podsumaB.value = BSum
    podsumaC.value = CSum
    podsumaD.value = DSum
    let points  = ASum + BSum + CSum + DSum;
    suma.value = points;

    let _przerysowanieFigur = ""
    if(points <= 48){
      _przerysowanieFigur = "niski"
    }
    else if(points > 48 && points <= 66 ){
      _przerysowanieFigur = "przeciętny"
    }
    else if(points > 66){
      _przerysowanieFigur = "wysoki"
    }
    p.innerHTML = "Wynik: " + _przerysowanieFigur
}

function dodajUwage(uwaga){
    let uwagiTextBox = document.getElementById("uwagi")
    uwagiTextBox.value += uwaga
}

function countAnaliza(){
    let p = document.getElementById("wynikAnaliza")
    let analiza = parseInt(document.getElementsByName("ana")[0].value)
    let _analiza = ""
    if(analiza < 7) {
        _analiza = "niski";
      } 
      else if(analiza >= 7) {
        _analiza = "przeciętny";
      } 
      else if(analiza == -1) { // brak zakresu wysokiego dla 7 latkow
        _analiza = "wysoki"
      }
      p.innerHTML = "Wynik: " + _analiza
}

function countSynteza(){
    let p = document.getElementById("wynikSynteza")
    let synteza = parseInt(document.getElementsByName("syn")[0].value)
    let _synteza = ""
    if(synteza < 7) {
        _synteza = "niski";
      } 
      else if( synteza >= 7) {
        _synteza = "przeciętny";
      } 
      else if(synteza == -1) { // brak zakresu wysokiego dla 7 latkow
        _synteza = "wysoki"
      }
      p.innerHTML = "Wynik: " + _synteza
}
