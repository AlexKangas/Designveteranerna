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

    },
    created: function(){
        socket.on('initialize', function(infoData) {
            this.info = infoData.info;
            console.log(infoData.id);
        }.bind(this));
    },

    methods: {
        getNext: function(){
            this.infoId++;
            return this.infoId;
        }
        ,
        sendInfo: function(){

            this.participants.push(this.fullname);
            this.participants.push(this.gender);

            socket.emit("sendInfo", {
                infoId: this.getNext(),
                participant: this.participants[0],
                gender: this.participants[1],
                socketId: this.socketId,

            });
        },
    }
})
