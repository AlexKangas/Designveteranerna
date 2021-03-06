/* jslint node: true */
/* eslint-env node */
'use strict';

// Require express, socket.io, and vue
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Pick arbitrary port for server
const port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));
// Serve vue from node_modules as vue/
app.use('/vue',
        express.static(path.join(__dirname, '/node_modules/vue/dist/')));
// Serve index.html directly as root page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});
// Serve map.html as /map
app.get('/map', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/map.html'));
});
// Serve dispatcher.html as /dispatcher
app.get('/dispatcher', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/dispatcher.html'));
});
app.get('/algorithm', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/algorithm.html'));
});
app.get('/userinfo', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/userinfo.html'));
});
app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});
app.get('/form', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/form.html'));
});
// Serve dispatcher.html as /dispatcher
app.get('/waiting_for_matching', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/waiting_for_matching.html'));
});

app.get('/contact_information', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/contact_information.html'));
});
app.get('/contact_information_sent', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/contact_information_sent.html'));
});
app.get('/confirm_contact_information', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/confirm_contact_information.html'));
});
app.get('/user_shared_contact', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/user_shared_contact.html'));
});
// Serve dispatcher.html as /dispatcher
app.get('/go_to_table', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/go_to_table.html'));
});
// Serve dispatcher.html as /dispatcher
app.get('/review', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/review.html'));

});
app.get('/participant_start', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/participant_start.html'));

});
app.get('/previous_dates', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/previous_dates.html'));

});
app.get('/manager_start', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/manager_start.html'));

});





// Store data in an object to keep the global namespace clean and
// prepare for multiple instances of data if necessary
function Data() {
    this.orders = {};
}
Data.prototype.addOrder = function(order) {
    // Store the order in an "associative array" with orderId as key
    this.orders[order.orderId] = order;
};

Data.prototype.getAllOrders = function() {
    return this.orders;
};


function Info(){
    this.users = [];
}

Info.prototype.addUser = function(user){
    this.users[this.users.length] = user;
};

Info.prototype.getAllUsers = function(){
    return this.users;
};

Info.prototype.lookUpName = function(target){
    for(let i = 0 ; i < this.users.length; i++){

        if(this.users[i].participant == target){
            return {bool:true, value:this.users[i]};
        }
    }
};

function Dates(){
    this.dates = [];
}

Dates.prototype.addDates = function(date){
    this.dates = date;
};

Dates.prototype.getAllDates = function(){
    return this.dates;
};


function ShareInfo(){
    this.shareinfo = [];
}

ShareInfo.prototype.addShareInformation = function(key,val){
    this.shareinfo[this.shareinfo.length] = {name: key,value: val};
};

ShareInfo.prototype.getShareInformation = function(key){

    for (let i = 0 ; i < this.shareinfo.length; i++){

        if(this.shareinfo[i].name == key){
            return this.shareinfo[i].value;
        }
    }
}
ShareInfo.prototype.lookUpName = function(keyName){

    for(let i = 0; i < this.shareinfo.length; i++){
        if(this.shareinfo[i].name == keyName){
            return {bool: true, value: this.shareinfo[i]};
        }
    }
}

function Ratings(){
    this.ratings = [];
}

Ratings.prototype.addRating = function(r){
    this.ratings[this.ratings.length] = r
}

Ratings.prototype.getAllRatings = function(){
    return this.ratings;
}



const data = new Data();
const infoData = new Info();
const allDates = new Dates();
const sharingData = new ShareInfo();
const ratingData = new Ratings();

io.on('connection', function(socket) {
    // Send list of orders when a client connects
    socket.emit('initialize', {users: infoData.getAllUsers()});

    console.log('a user connected');
    // When a connected client emits an "addOrder" message
    socket.on('addOrder', function(order) {

        data.addOrder(order);
        // send updated info to all connected clients,
        // note the use of io instead of socket
        io.emit('currentQueue', { orders: data.getAllOrders() });
    });
    // sends info to the manager about themselves from form.html
    socket.on('sendInfo', function(info){
        infoData.addUser(info);
        io.emit('currentInfo' , {users: infoData.getAllUsers()});
    });

    socket.on('startEvent', function(date){

        allDates.addDates(date);
        let users = infoData.getAllUsers();
        let arr = allDates.getAllDates().dates;


        for(let k = 0; k < users.length; k++){

            for(let i = 0; i < arr.length; i++){

                if(arr[i].fst == users[k].participant){
                    io.to(users[k].infoId).emit('currentDate', {dates: arr[i].snd, table: arr[i].table})
                    break;
                }

                else if(arr[i].snd == users[k].participant){
                    io.to(users[k].infoId).emit('currentDate', {dates: arr[i].fst, table: arr[i].table})
                    break;
                }
            }
        }
    });

    socket.on('timer', function(t){
        io.emit('respond_timer',{
            time:t
        })
    });
    socket.on('sendRating', function(rating){

        let userExistInArray = false;
        let ratings = ratingData.getAllRatings();
        for(let i = 0; i < ratings.length; i++){
            if(rating.user == ratings[i].user){
                ratingData.getAllRatings()[i] = rating;
                userExistInArray = true;
                break;
            }

        }

        if(userExistInArray == false){
            ratingData.addRating(rating);
        }
        io.emit('receiveRating',{
            ratingInfoArray: ratingData.getAllRatings()
        });

    })

    socket.on("ending",function(s){
        console.log("That was all for today!");
        io.to(s).emit('sharescreen',)
    });

    // user sends a share signal when sharing personal information
    socket.on("share", function(name,value){

        sharingData.addShareInformation(name,value);
        let reqList = value.shareInfo;
        let reqName = value.name;
        let reqId = value.socketId;

        for(let i = 0; i < reqList.length; i++){

            let receiverInfo = sharingData.getShareInformation(reqList[i]);
            if(receiverInfo != undefined){

                let recList = receiverInfo.shareInfo;
                let recName = receiverInfo.name;
                let recId = receiverInfo.socketId;

                /*console.log("det här är reclist:" +recList);
                console.log("recName:" + recName);
                console.log("recId:" + recId);
                console.log("reqName:" + reqName);*/
                for(let k = 0; k < recList.length; k++){
                    if(recList[k] == recName){
                    }
                    else if(recList[k] == reqName){

                        io.to(recId).emit('receiveInformation', {
                            msg: value
                        })

                        io.to(reqId).emit('receiveInformation', {
                            msg: receiverInfo
                        })
                    }
                    else{
                    }
                }
            }

        }


    });

});

/* eslint-disable-next-line no-unused-vars */
const server = http.listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});
