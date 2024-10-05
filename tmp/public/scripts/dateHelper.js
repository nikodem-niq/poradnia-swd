const countAge = () => {
    let inputData = document.getElementById("dateInput").value;
    let outputP = document.getElementById("age");

    let now = moment();
    let birthday = moment(inputData, "YYYY-MM-DD");

    let years = now.diff(birthday, "years");
    let months = now.diff(birthday, "months") % 12;


    if (isNaN(years) || isNaN(months)) {
        outputP.innerHTML = "Wiek: Wpisz poprawną wartość"
    } else {
        outputP.innerHTML = "Wiek: " + years.toString() + ";" + months.toString();
    }

}

