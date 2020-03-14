'use strict';
const socket = io(
    { reconnection:false}
);


const vm = new Vue({
    el:"#main",
    data:{
        info:[],
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
            console.log(socket.id);
        }.bind(this));
    },
    methods:{
        send:function(){
            socket.emit("currentInfo",{
                socketId: this.socketId
            });
        }
    }

})
