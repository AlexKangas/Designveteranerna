'use strict';
const socket = io(
    {reconnection:false}
);


const vm = new Vue({
    el:"#main",
    data:{
        fullname:'',
        phone: 0,
        email: '',
        age: 0,
        gender:'',
        participants: [],
        information: new Array(),
        infoId: 0,
        users: [],
        dates:[],

        bool: false,
    },
    created: function(){

        socket.on('initialize', function(infoData) {
            this.users = infoData.users;
        }.bind(this));

        socket.on('currentInfo', function(infoData){
            this.users = infoData.users;
        }.bind(this));

        socket.on('currentDate', function(date){
            this.dates = date.dates;
        }.bind(this));
        socket.on('respond_timer', function(t){
            this.bool = t.bool;
            document.getElementById("participantEvent").style.display="none";
            document.getElementById("rating").style.display="block";
        }.bind(this));


    },

    methods: {
        sendInfo: function(){

            socket.emit("sendInfo", {
                infoId: socket.id,
                participant: this.fullname,
                gender: this.gender
            });

            document.getElementById("register").style.display="none";
            document.getElementById("sendButton").style.display="none";
            document.getElementById("participantEvent").style.display="block";

        },
    }
})
