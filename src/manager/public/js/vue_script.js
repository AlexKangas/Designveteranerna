'use strict';
const socket = io();


const vm= new Vue({
    el:"#main",
    data:{

    },
    methods:{
        unMatch: function(event){
            //create necessary elements and fetch unmatchtable
            let matchtable = event.currentTarget.parentNode.parentNode.parentNode.parentNode.id;
            if(matchtable === "matchTable"){
                let uTable= document.getElementById("unMatchTable");
                let newrow= document.createElement("tr");
                let newtd= document.createElement("td");
                let p = document.createElement("p");


                let id = event.currentTarget.id;
                let elem= document.getElementById(id);
                let cName= elem.parentNode.className;
                let text = document.createTextNode(id);
                newtd.className= cName;

                p.appendChild(text);
                newtd.appendChild(p);
                newrow.appendChild(newtd);
                uTable.appendChild(newrow);

                elem.parentNode.removeChild(elem);

            }
            else{
                alert("Flyttar till matchtable");
            }
        }

    }
})
