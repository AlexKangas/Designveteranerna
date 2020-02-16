'use strict';
const socket = io();


const vm= new Vue({
    el:"#main",
    data:{
        selected: [],
        minutes:0,
        seconds:0,

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
            if(event.currentTarget.parentNode.parentNode == document.getElementById("matchTable") || bool){

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

                let text1 = document.createTextNode(newtd1.id);
                let text2 = document.createTextNode(newtd2.id);

                newrow1.addEventListener("click",this.unMatch);
                newrow2.addEventListener("click",this.unMatch);

                newtd1.appendChild(text1);
                newrow1.appendChild(newtd1);

                newtd2.appendChild(text2);
                newrow2.appendChild(newtd2);

                let uTable = document.getElementById("unMatchTable");
                uTable.appendChild(newrow1);
                uTable.appendChild(newrow2);

                row.parentNode.removeChild(row);

            }
            else{
                let target = event.currentTarget;
                let child = event.currentTarget.firstChild;

                if((this.selected.includes(child.id) && child.className=="menColumn") || (this.selected.includes(child.id) && child.className == "womenColumn")){

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

                }else{
                    alert("don't allow to mark more than two person");
                }

            }
        },
        rematch: function(){
            let person1 = document.getElementById(this.selected[0]);
            let person2 = document.getElementById(this.selected[1]);
            let mTable = document.getElementById("matchTable");


            if(this.selected.length == 2 &&( (person1.className=="menColumn" && person2.className =="womenColumn") || (person1.className=="womenColumn" && person2.className=="menColumn" ))){


                let newrow= document.createElement("tr");
                let newtd1= document.createElement("td");
                let newtd2= document.createElement("td");

                if(person1.className=="menColumn"){
                    //Lägger till paret i matchtable

                    let text1 = document.createTextNode(person1.id);
                    newtd1.id = person1.id;
                    newtd1.className = person1.className;
                    newtd1.appendChild(text1);
                    newrow.appendChild(newtd1);

                    let text2 = document.createTextNode(person2.id);
                    newtd2.id = person2.id;
                    newtd2.className = person2.className;
                    newtd2.appendChild(text2);
                    newrow.appendChild(newtd2)
                    newrow.addEventListener("click",this.unMatch);;

                    mTable.appendChild(newrow);

                    //Tar bort dem från unMatchTable och selected
                    let toRemove1 = person1.parentNode;
                    let toRemove2 = person2.parentNode;

                    toRemove1.parentNode.removeChild(toRemove1);
                    toRemove2.parentNode.removeChild(toRemove2);
                    this.selected.pop();
                    this.selected.pop();


                }
                else{
                    //Lägger till paret i matchtable
                    let text2 = document.createTextNode(person2.id);
                    newtd2.id = person2.id;
                    newtd2.className = person2.className;
                    newtd2.appendChild(text2);
                    newrow.appendChild(newtd2);

                    let text1 = document.createTextNode(person1.id);
                    newtd1.id = person1.id;
                    newtd1.className = person1.className;
                    newtd1.appendChild(text1);
                    newrow.appendChild(newtd1);
                    newrow.addEventListener("click",this.unMatch);

                    mTable.appendChild(newrow);

                    //Tar bort dem från unMatchTable och selected
                    let toRemove1 = person1.parentNode;
                    let toRemove2 = person2.parentNode;
                    toRemove1.parentNode.removeChild(toRemove1);
                    toRemove2.parentNode.removeChild(toRemove2);
                    this.selected.pop();
                    this.selected.pop();
                }
            }
            else{
                alert("Select two persons (one man and one woman)");
            }
        },
        startEvent: function(){
            var countDownDate = new Date().getTime() + 1000*10;

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
                document.getElementById("timer").innerHTML =  this.minutes + "m " + this.seconds + "s ";
                let button = document.getElementById("startEvent");
                button.disabled=true;
                button.className="uClickAble";
                // If the count down is over, write some text
                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("timer").innerHTML = "Date End";
                    button.disabled=false;
                    button.className="buttons";
                }
            }, 1000);
        }
    }


})
