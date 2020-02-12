'use strict';
const socket = io();


const vm= new Vue({
    el:"#main",
    data:{

    },
    methods:{
        unMatch: function(event){

            let newrow= document.createElement("tr");
            let newtd= document.createElement("td");
            newtd.className ="unMatched";
            let p = document.createElement("p");

            let id = event.currentTarget.id;

            let text = document.createTextNode(id);
            p.appendChild(text);
            newtd.appendChild(p);
            newrow.appendChild(newtd);
            let table= document.getElementById("myTable");
            table.appendChild(newrow);
            let elem = document.getElementById(id);
            elem.parentNode.removeChild(elem);




        }
    }
})
