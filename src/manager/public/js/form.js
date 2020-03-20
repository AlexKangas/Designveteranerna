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

        table: [],

        rating1: 0,
        rating2: 0,
        rating3: 0,

        ratings:[],
        ratedDates:[],
        shareinfo: [],
        bool: false,

	    contactInfo: JSON.parse(localStorage.getItem("contactInfo") || "[]"),
	    state: "register",
        counter:0,

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
            this.table = date.table;
        }.bind(this));

        socket.on('respond_timer', function(t){
            document.getElementById("participantEvent").style.display="none";
            document.getElementById("rating").style.display="block";
            document.getElementById("ratingButton").style.display="block";
        }.bind(this));

        socket.on('sharescreen',function(){
            document.getElementById("rating").style.display="none";
            document.getElementById("ratingButton").style.display="none";
            document.getElementById("share").style.display="block";

        });

        socket.on('receiveInformation', function(msg){
            this.shareinfo.push(msg.msg);
	        if(localStorage.contactInfo){
		        let contactInfoTotal = JSON.parse(localStorage.getItem("contactInfo") || "[]");
		        contactInfoTotal = contactInfoTotal.concat(this.shareinfo);
		        localStorage.setItem("contactInfo", JSON.stringify(contactInfoTotal));
	        }
	        else{
		        localStorage.setItem("contactInfo", JSON.stringify(this.shareinfo));
	        }
        }.bind(this));

    },

    methods: {
        sendInfo: function(){

            socket.emit("sendInfo", {
                infoId: socket.id,
                participant: this.fullname,
                email: this.email,
                phone: this.phone,
                gender: this.gender,
                age: this.age
            });

            document.getElementById("register").style.display="none";
            document.getElementById("sendButton").style.display="none";
            document.getElementById("participantEvent").style.display="block";
	        document.getElementById("contactInfoButton").style.display="none";
            document.getElementById("viewRatings").style.display="none";
        },
        sendRating: function(){
            let c =this.counter;

            if(c == 2){

                this.ratedDates.push({
                    name: this.dates,
                    fst: this.rating1,
                    snd: this.rating2,
                    rd: this.rating3,
                });
                socket.emit('ending',socket.id)
            }
            else{
                this.counter+=1;
                this.ratedDates.push({
                    name: this.dates,
                    fst: this.rating1,
                    snd: this.rating2,
                    rd: this.rating3,
                });

                document.getElementById("rating").style.display="none";
                document.getElementById("ratingButton").style.display="none";
                document.getElementById("participantEvent").style.display="block";
            }
            console.log(c);

        },
        sendInformation: function(){

            socket.emit('share',this.fullname
                        , {
                            shareInfo: this.ratings,
                            name: this.fullname,
                            socketId: socket.id,
                            email:this.email,
                            gender:this.gender,
                            phone:this.phone,
                            age:this.age
                        });
            document.getElementById("marked").style.display="none";
            document.getElementById("sendInformation").style.display="none";
	        document.getElementById("contactInfoButton").style.display="inline";
            document.getElementById("viewRatings").style.display="inline";
	        this.state = "share";
        },
	    viewContactInfo: function(){
	        console.log(this.state);
	        this.contactInfo = JSON.parse(localStorage.getItem("contactInfo") || "[]");
	        if (this.state == "register"){
		        document.getElementById("register").style.display="none";
		        document.getElementById("sendButton").style.display="none";

	        }
	        else if (this.state == "share") {
		        document.getElementById("share").style.display="none";
		        document.getElementById("sharescreen").style.display="none";
	        }
	        document.getElementById("contactInfoButton").style.display="none";
            document.getElementById("viewRatings").style.display="none";
	        document.getElementById("contactInfo").style.display="block";
	    },
        viewRatings:function(){
            console.log(this.state);
	        this.contactInfo = JSON.parse(localStorage.getItem("contactInfo") || "[]");
	        if (this.state == "register"){
		        document.getElementById("register").style.display="none";
		        document.getElementById("sendButton").style.display="none";

	        }
	        else if (this.state == "share") {
		        document.getElementById("share").style.display="none";
		        document.getElementById("sharescreen").style.display="none";
	        }
            document.getElementById("contactInfoButton").style.display="none";
            document.getElementById("viewRatings").style.display="none";
            document.getElementById("formerRatings").style.display ="inline";
        },

	    goBack: function(){
	        console.log(this.state);
	        if (this.state == "register") {
		        document.getElementById("register").style.display="block";
		        document.getElementById("sendButton").style.display="block";
	        }
	        else if (this.state == "share") {
		        document.getElementById("share").style.display="block";
		        document.getElementById("sharescreen").style.display="block";
	        }
            document.getElementById("viewRatings").style.display="inline";
	        document.getElementById("contactInfoButton").style.display="inline";
	        document.getElementById("contactInfo").style.display="none";
	    },
        hideRatings: function(){
            if (this.state == "register") {
		        document.getElementById("register").style.display="block";
		        document.getElementById("sendButton").style.display="block";
	        }
	        else if (this.state == "share") {
		        document.getElementById("share").style.display="block";
		        document.getElementById("sharescreen").style.display="block";
	        }
            document.getElementById("viewRatings").style.display="inline";
	        document.getElementById("contactInfoButton").style.display="inline";
	        document.getElementById("formerRatings").style.display="none";
        },
	    clearData: function(){
	        localStorage.clear();
	        this.contactInfo = null;
	    },
    }
})
