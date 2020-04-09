'use strict';
const socket = io(
    {reconnection:false}
);


const vm = new Vue({
    el:"#main",
    data:{
        // User information
        fullname:'',
        phone: 0,
        email: '',
        age: 0,
        gender:'',
        participants: [],
        infoId: 0,
        users: [],

        //Users sees the currentDate during the date
        dates:[],
        currentDate:"",

        //users gets informed of where they should go with the seat variable
        table: [],
        seat:"",

        // ratings from 1-5 for all the 3 questions these get updated during new ratings
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
        // Initializes so that recently logged-in-users haves the same data of users as the rest.
        socket.on('initialize', function(infoData) {
            this.users = infoData.users;
        }.bind(this));

        // Updates whenever another user logs in.
        socket.on('currentInfo', function(infoData){
            this.users = infoData.users;
        }.bind(this));

        // Called whenever a 'startEvent' message is sent, usually with the 'startEvent' function. Keeps track of all the dates
        socket.on('currentDate', function(date){
            this.dates = date.dates;
            this.currentDate = this.dates;
            this.table = date.table;
            this.seat = this.table;
        }.bind(this));

        // Called whenever a 'timer' message is sent, usually with the 'startEvent' function
        socket.on('respond_timer', function(t){
            document.getElementById("participantEvent").style.display="none";
            document.getElementById("rating").style.display="block";
            document.getElementById("ratingButton").style.display="block";
        }.bind(this));

        // Called whwnever an 'ending' message is sent, usually with the 'sendRating' function
        socket.on('sharescreen',function(){
            document.getElementById("rating").style.display="none";
            document.getElementById("ratingButton").style.display="none";
            document.getElementById("share").style.display="block";

        });

        // Called whenever a 'share' message is sent, usually with the function 'sendInformation'
        socket.on('receiveInformation', function(msg){
            // All matches is stored inside the array 'shareinfo'
            this.shareinfo.push(msg.msg);
	        if(localStorage.contactInfo){
		        let contactInfoTotal = JSON.parse(localStorage.getItem("contactInfo") || "[]");
		        contactInfoTotal = contactInfoTotal.concat(this.shareinfo);
		        localStorage.setItem("contactInfo", JSON.stringify(contactInfoTotal));
	        }
	        else{
		        localStorage.setItem("contactInfo", JSON.stringify(this.shareinfo));
	        }
            alert("You and "+msg.msg.name+" matched!");
        }.bind(this));

    },

    methods: {
        // Called whenever a participants signs in, information is sent to the manager.
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
            let c = this.counter;

            if(c == 1){

                this.ratedDates.push({
                    name: this.dates,
                    fst: this.rating1,
                    snd: this.rating2,
                    rd: this.rating3,
                });
                socket.emit('sendRating',{
                    user: this.fullname,
                    dates:this.ratedDates,
                });
                socket.emit('ending',socket.id);
            }
            else{
                this.counter+=1;
                this.ratedDates.push({
                    name: this.dates,
                    fst: this.rating1,
                    snd: this.rating2,
                    rd: this.rating3,
                });

                socket.emit('sendRating',{
                    user: this.fullname,
                    dates:this.ratedDates,
                });

                document.getElementById("rating").style.display="none";
                document.getElementById("ratingButton").style.display="none";
                document.getElementById("participantEvent").style.display="block";
            }
            //console.log(c);

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

            document.getElementById("sendInformation").style.display="none";
            document.getElementById("share").style.display="none";
	        document.getElementById("contactInfoButton").style.display="inline";
            document.getElementById("viewRatings").style.display="inline";
            document.getElementById("sharescreen").style.display="inline";
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
		        document.getElementById("markscreen").style.display="none";
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
		        document.getElementById("markscreen").style.display="none";
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
		        document.getElementById("markscreen").style.display="block";
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
		        document.getElementById("markscreen").style.display="block";
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
