




let link = document.getElementById("link");
function buttonClicked() {

    if (sessionStorage.finishedDates) {
	sessionStorage.finishedDates = Number(sessionStorage.finishedDates)+1;
    }
    else {
	sessionStorage.finishedDates = 1;
    }

    if (Number(sessionStorage.finishedDates) >= 3) {
	link.href = '/contact_information';
    }

}
