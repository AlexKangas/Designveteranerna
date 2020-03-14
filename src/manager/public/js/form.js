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
        info: {},
        dates:[],

    },
    created: function(){

        socket.on('initialize', function(infoData) {
            this.info = infoData.info;
        }.bind(this));

        socket.on('currentInfo', function(infoData){
            var size = 0;
            for(var key in this.info){
                if(this.info.hasOwnProperty(key)) size++;
            }
            this.info = infoData.info;
        }.bind(this));

        socket.on('currentDates',function(dates){
            this.dates = dates;
        });
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
