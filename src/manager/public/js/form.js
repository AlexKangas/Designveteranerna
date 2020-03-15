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

    },
    created: function(){

        socket.on('initialize', function(infoData) {
            this.users = infoData.users;
        }.bind(this));

        socket.on('currentInfo', function(infoData){
            this.users = infoData.users;
        }.bind(this));

    },

    methods: {
        getNext: function(){
            this.infoId++;
            return this.infoId;
        }
        ,
        sendInfo: function(){

            socket.emit("sendInfo", {
                infoId:this.getNext(),
                participant: this.fullname,
                gender: this.gender


            });
        },
    }
})
