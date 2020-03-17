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

        rating1: 0,
        rating2: 0,
        rating3: 0,

        ratings:[],

        shareinfo: [],
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
            document.getElementById("participantEvent").style.display="none";
            document.getElementById("rating").style.display="block";
            document.getElementById("ratingButton").style.display="block"
        }.bind(this));

        socket.on('sharescreen',function(){
            document.getElementById("participantEvent").style.display="none";
            document.getElementById("share").style.display="block";
        });

        socket.on('receiveInformation', function(msg){

            this.shareinfo.push(msg.msg);
        }.bind(this));

    },

    methods: {
        sendInfo: function(){

            socket.emit("sendInfo", {
                infoId: socket.id,
                participant: this.fullname,
                email: this.email,
                phone: this.phone,
                gender: this.gender
            });

            document.getElementById("register").style.display="none";
            document.getElementById("sendButton").style.display="none";
            document.getElementById("participantEvent").style.display="block";

        },
        sendRating: function(){
            document.getElementById("rating").style.display="none";
            document.getElementById("ratingButton").style.display="none";
            document.getElementById("participantEvent").style.display="block";

        },
        sendInformation: function(){

            socket.emit('share',this.fullname

            , {shareInfo: this.ratings,
                name: this.fullname,
               socketId: socket.id });
            document.getElementById("marked").style.display="none";
            document.getElementById("sendInformation").style.display="none";
        }
    }
})
