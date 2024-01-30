module = {};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, set, remove, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyBBa-8U0sIt2gJTuevwCRAO4cYs22Q9AlY",
    authDomain: "addi-chat-app.firebaseapp.com",
    projectId: "addi-chat-app",
    storageBucket: "addi-chat-app.appspot.com",
    messagingSenderId: "356898130917",
    appId: "1:356898130917:web:b1aebfad0d6a69022cbd0c",
    measurementId: "G-BZXTK3EQ5H"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var msgTxt = document.getElementById('msgTxt');
var messages = document.getElementById('messages');
var sender = sessionStorage.getItem('sender') || prompt('PLEASE ENTER YOUR NAME');
sessionStorage.setItem('sender', sender);

module.sendMsg = function () {
    var msg = msgTxt.value;
    var timestamp = new Date().getTime();
    set(ref(db, "messages/" + timestamp), {
        msg: msg,
        sender: sender
    });
    msgTxt.value = "";
};

onChildAdded(ref(db, "messages"), (data) => {
    var msgClass = data.val().sender === sender ? 'me' : 'notMe';
    var messageElement = document.createElement('div');
    messageElement.className = 'outer';
    messageElement.innerHTML = `
        <div id="inner" class="${msgClass}">
            ${data.val().sender}: ${data.val().msg}
            ${msgClass === 'me' ? `<button onclick="module.dltMsg('${data.key}')">Delete</button>` : ''}
        </div>
    `;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});

module.dltMsg = function (key) {
    if (confirm('Are you sure you want to delete this message?')) {
        remove(ref(db, "messages/" + key));
    }
};

onChildRemoved(ref(db, "messages"), (data) => {
    var messageElement = document.getElementById(data.key);
    if (messageElement) {
        messages.removeChild(messageElement);
    }
});
