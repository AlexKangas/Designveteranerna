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
app.get('/manager_start', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/manager_start.html'));

});

// Store data in an object to keep the global namespace clean and
// prepare for multiple instances of data if necessary
function Data() {
    this.orders = {};
}

function Info(){
    this.info = {};
}

/*
  Adds an order to to the queue
*/
Data.prototype.addOrder = function(order) {
    // Store the order in an "associative array" with orderId as key
    this.orders[order.orderId] = order;
};

Data.prototype.getAllOrders = function() {
    return this.orders;
};

Info.prototype.addInfo = function(info){
    this.info[info.infoId] = info;
}

Info.prototype.getAllInfo = function(){
    return this.info;
}
const data = new Data();
const infoData = new Info();
const dates = [];

io.on('connection', function(socket) {
    // Send list of orders when a client connects
    socket.emit('initialize', {info: infoData.getAllInfo()});

    console.log('a user connected');
    // When a connected client emits an "addOrder" message
    socket.on('addOrder', function(order) {

        data.addOrder(order);
        // send updated info to all connected clients,
        // note the use of io instead of socket
        io.emit('currentQueue', { orders: data.getAllOrders() });
    });
    socket.on('startEvent', function(date){
        dates.push(date);
        io.to(socket.id).emit('currentDates', { dates: dates});
    });
    socket.on('sendInfo', function(info){
        infoData.addInfo(info);
        //infoData.addInfo(socket.id);

        io.emit('currentInfo' , {info: infoData.getAllInfo()});
    });

});

/* eslint-disable-next-line no-unused-vars */
const server = http.listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});
