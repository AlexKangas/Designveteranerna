'use strict';
const socket = io(
    {reconnection:false}
);


const vm = new Vue({
    el:"#main",
    data:{
	shareinfo: JSON.parse(localStorage.getItem("shareinfo") || "[]"),
    },
    methods: {
	clearData: function(){
	    localStorage.clear();
	    this.shareinfo = null;
	}
    }
})
