'use strict';
const socket = io();


const vm = new Vue({
    el:"#main",
    data:{
        //Tänkte användas till att skicka information via socket.
        //information: [],
        users:[],
        infoId: 0,
        socketId:'',
        // Markerade användare stoppas in här vid manuell matchning
        selected: [],
	    selectedTable: [],
        //Variabler för att visa timerns nedräkning.
        minutes:0,
        seconds:0,
        counter:0,

        //deltagar information sätt in i arrayen participants
        fullname:'',
        phone: 0,
        email: '',
        age: 0,
        gender: '',
        participants: [],

        dates:[],
        unMatchButton: false,

        ratings:[],
    },


    created: function() {
        socket.on('initialize', function(infoData) {
            this.users = infoData.users
        }.bind(this));

        socket.on('currentInfo', function(infoData) {
            this.users = infoData.users
        }.bind(this));

        socket.on('receiveRating', function(rating){
            this.ratings = rating.ratingInfoArray
        }.bind(this));

    },



    methods:{
        unMatch: function(event){
            let children = document.getElementById("matchTable").childNodes;
            let bool = false;
            for(let i = 0; i < children.length; i++){
                if(children[i] === event.currentTarget){
                    bool = true;
                }
            }
            if((event.currentTarget.parentNode.parentNode == document.getElementById("matchTable") || bool) && event.currentTarget.childNodes[0].textContent != "" && this.unMatchButton){
                this.unMatchButton = false;
                let newrow1= document.createElement("tr");
                let newtd1= document.createElement("td");

                let newrow2= document.createElement("tr");
                let newtd2= document.createElement("td");

                let row = event.currentTarget;

                let person1 = row.cells[0];
                let person2= row.cells[1];

                newtd1.id = person1.id;
                newtd1.className=person1.className;

                newtd2.id = person2.id;
                newtd2.className = person2.className;

                let text1 = document.createTextNode(person1.id);
                let text2 = document.createTextNode(person2.id);

                newrow1.addEventListener("click",this.unMatch);
                newrow2.addEventListener("click",this.unMatch);

                newtd1.appendChild(text1);
                newrow1.appendChild(newtd1);

                newtd2.appendChild(text2);
                newrow2.appendChild(newtd2);

                let uTable = document.getElementById("unMatchTable");
                uTable.appendChild(newrow1);
                uTable.appendChild(newrow2);

                
		        person1.textContent = "";
		        person2.textContent = "";

                person1.id = "";
                person2.id = "";

                person1.className = "";
                person2.className = "";

		        let unMatchButton = document.getElementById("")

            }
            else if(event.currentTarget.parentNode.parentNode.id == "matchTable"){
		        let target = event.currentTarget;
		        let child = event.currentTarget.cells[2];

		        if(this.selectedTable.includes(child.id) && child.className == "Table"){
		            this.selectedTable.splice(0,1);
		            target.className = "";
		        }
		        else if (this.selectedTable.length < 1){
		            target.className="selectedTable";
		            this.selectedTable.push(child.id);
		        }
		        else{
		            alert("You cannot mark more than one table");
		        }
	        }
	        else{
                let target = event.currentTarget;
		        let child = event.currentTarget.firstChild;

                if((this.selected.includes(child.id) && child.className=="Male") || (this.selected.includes(child.id) && child.className == "Female")){

		            for(var i = 0; i < this.selected.length; i++ ){
                        if(this.selected[i] === child.id){
			                this.selected.splice(i,1);
			                target.className = "";
			            }
		            }
		        }
                else if(this.selected.length < 2){
		            target.className="selected";
		            this.selected.push(child.id);

                }
		        else{
		            alert("You cannot mark more than two person");
                }

            }
        },


        rematch: function(){
            let person1 = document.getElementById(this.selected[0]);
            let person2 = document.getElementById(this.selected[1]);

	        let table = document.getElementById(this.selectedTable[0]);
            let mTable = document.getElementById("matchTable");

            if(this.selected.length == 2 &&
	           this.selectedTable.length == 1 &&
	           ((person1.className=="Male" && person2.className =="Female") || (person1.className=="Female" && person2.className=="Male"))){



                if(person1.className == "Male"){
                    //Lägger till paret i matchtable
		            table.parentNode.cells[0].textContent = person1.id;
		            table.parentNode.cells[1].textContent = person2.id;

                    table.parentNode.cells[0].id = person1.id;
                    table.parentNode.cells[1].id = person2.id;

                    table.parentNode.cells[0].className = person1.className;
                    table.parentNode.cells[1].className = person2.className;


                    //Tar bort dem från unMatchTable och selected
                    let toRemove1 = person1.parentNode;
                    let toRemove2 = person2.parentNode;

                    toRemove1.parentNode.removeChild(toRemove1);
                    toRemove2.parentNode.removeChild(toRemove2);
                    this.selected.pop();
                    this.selected.pop();
		            this.selectedTable.pop();
		            table.parentNode.className = "";
                }
                else if(person1.className == "Female"){

                    //Lägger till paret i matchtable
		            table.parentNode.cells[0].textContent = person2.id;
		            table.parentNode.cells[1].textContent = person1.id;

                    table.parentNode.cells[0].id = person2.id;
                    table.parentNode.cells[1].id = person1.id;

                    table.parentNode.cells[0].className = person2.className;
                    table.parentNode.cells[1].className = person1.className;

                    //Tar bort dem från unMatchTable och selected
                    let toRemove1 = person1.parentNode;
                    let toRemove2 = person2.parentNode;

                    toRemove1.parentNode.removeChild(toRemove1);
                    toRemove2.parentNode.removeChild(toRemove2);
                    this.selected.pop();
                    this.selected.pop();
		            this.selectedTable.pop();
		            table.parentNode.className = "";
                }
                else{
                    alert("nånting gick fel, kolla rematch");
                }
            }
            else{
		        if (this.selected.length != 2 || person1.className=="Male" && person2.className !="Female" || person1.className=="Female" && person2.className !="Male") {
		            alert("Select two persons (one man and one woman)");
		        }

		        if (this.selectedTable.length != 1) {
		            alert("Select an empty table")
		        }
            }
        },


        startEvent: function(){
            let uTable = document.getElementById("unMatchTable");
            if(uTable.rows.length != 1){

                alert("All participant must be matched before event starts!");
            }
            else{
                this.counter += 1;
                let c = this.counter;

                document.getElementById("eventState").innerHTML= "Date No." + this.counter+"    ongoing";
                var countDownDate = new Date().getTime() + 1000*2;

                let mTable = document.getElementById('matchTable');
                let size = mTable.rows.length;
                let dates = [];

                for(var i = 0; i < size-1; ++i){
                    console.log("HÄR är jAg")
                    dates.push({fst:mTable.rows[i+1].cells[0].innerHTML,
                                snd:mTable.rows[i+1].cells[1].innerHTML,
                                table:mTable.rows[i+1].cells[2].id});
                }
                socket.emit('startEvent', {
                    dates: dates,
                });

                // Update the count down every 1 second
                var x = setInterval(function() {

                    // Get today's date and time
                    var now = new Date().getTime();

                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;

                    // Time calculations for days, hours, minutes and seconds
                    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    // Output the result in an element with id="demo"
                    //document.getElementById("eventState").innerHTML= "Date number:"+this.date;

                    document.getElementById("timer").innerHTML = "Time left:"+this.minutes + "m " + this.seconds + "s ";
                    let button = document.getElementById("startEvent");
                    button.disabled=true;
                    button.className="uClickAble";

                    socket.emit('addOrder', {
                        min: this.minutes,
                        sec: this.seconds

                    });

                    // If the count down is over, write some text
                    if (distance < 0) {
                        if(c == 3){
                            clearInterval(x);
                            socket.emit('timer',{
                                bool: true,
                            });
                            //button.disabled=true;
                            //button.className="uClickAble";
                        }
                        else{
                            clearInterval(x);
                            document.getElementById("eventState").innerHTML= "Event-Status: No ongoing dates";
                            document.getElementById("timer").innerHTML = "Date End";
                            button.disabled=false;
                            button.className="buttons";

                            socket.emit('timer',{
                                bool: true,
                            });
                        }
                    }

                }, 1000);
            }
        },



        loginAsManager: function(){
            let password = document.getElementById("password").value;
            console.log("MANAGERSTART");
            if(password == "0000"){
                window.location.assign("manager_start");
            }
        },
        runAlgorithm: function(){
            let uTable = document.getElementById("unMatchTable");
            let tableRows = uTable.rows

            //Om inga är 'unmatchade' så finns det ingen anledning att göra något
            if(tableRows.length == 1){
                alert("All participants are matched")
            }
            //Vi tar inte hand om fallet då det är ett ojämnt antal personer som 'unmtached'
            // Vi kollar modulo 0 eftersom det är alltid en rad i unMatch vilket är '<th>'
            else if((tableRows.length % 2) == 0){
                alert("Uneven number of participants!");
            }
            //Här kör vi algoritmen
            else{
                let males = [];
                let females = [];
                //Stoppar in alla personer i arrayerna "males" och "females" beroende på kön
                for (let i = 1 ; i < tableRows.length; i++){
                    let target = tableRows[i].firstChild;
                    if(target.className == "Male"){
                        males.push(target.id);
                    }
                    else if(target.className == "Female"){
                        females.push(target.id);
                    }
                    else{
                        console.log("NÅNTING GICK FEL I LOOPEN");
                    }
                }
                console.log(males +" " +females );

                if(males.length == females.length){
                    let mTable = document.getElementById("matchTable");
                    let mTableRows = mTable.rows;
                    let freeTables = [];

                    //Sparar alla lediga bord i 'freeTables'
                    for(let t = 1; t < mTableRows.length ; t++){
                        if(mTableRows[t].cells[0].id == null || mTableRows[t].cells[0].id == ""){
                            freeTables.push(t);
                        }
                    }
                    //Matchar all par till ett av borden i 'freeTables'
                    for(let k = 0; k < males.length;){
                        let randMNumber = Math.floor(Math.random() * Math.floor(males.length));
                        let randFNumber = Math.floor(Math.random() * Math.floor(males.length));

                        let male = males.splice(randMNumber,1)[0];
                        let female = females.splice(randFNumber,1)[0];
                        let tableNumber = freeTables.splice(0,1)[0];

                        let table = mTableRows[tableNumber];

                        let toRemove1 = document.getElementById(male).parentNode;
                        let toRemove2 = document.getElementById(female).parentNode;

                        toRemove1.parentNode.removeChild(toRemove1)
                        toRemove2.parentNode.removeChild(toRemove2)

                        table.cells[0].textContent = male;
                        table.cells[0].id = male;
                        table.cells[0].className = "Male";

                        table.cells[1].textContent = female;
                        table.cells[1].id = female;
                        table.cells[1].className = "Female";



                    }

                    freeTable.splice(1);

                }
                else{
                    console.log("There must be as many men as women and vice versa for running the algorithm")
                }
            }
        },

        viewRatings: function(){
            document.getElementById("grid").style.display = "none";
            document.getElementById("userRatings").style.display = "inline";
            document.getElementById("hideRatingsButton").style.display="block";
        },
        hideRatings:function(){


            document.getElementById("grid").style.display = "grid";
            document.getElementById("userRatings").style.display = "none";
            document.getElementById("hideRatingsButton").style.display="none"


        },
        viewAlgorithm: function(){
            document.getElementById("grid").style.display = "none";
            document.getElementById("Algorithm").style.display = "inline";
            document.getElementById("hideAlgorithmButton").style.display ="block";
        },
        hideAlgorithm:function(){
            document.getElementById("grid").style.display = "grid";
            document.getElementById("Algorithm").style.display = "none";
            document.getElementById("hideAlgorithmButton").style.display ="none";
        },
        viewUserInfo: function(){
            document.getElementById("grid").style.display = "none";
            document.getElementById("userInfo").style.display = "inline";
        },
        hideUserInfo: function(){
            document.getElementById("grid").style.display = "grid";
            document.getElementById("userInfo").style.display = "none";
        }
    }


})
