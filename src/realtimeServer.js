module.exports = httpServer => {
    const { Server } = require("socket.io");
    const io = new Server(httpServer);

    var socketsOnLineAdm = [];
    var socketsInHome = [];
    var AsignarAdm = 0;

    io.on("connection", socket => {
        
        // Agendar administradores
        socket.on("AdmOn", data => {
            socketsOnLineAdm.push(data);
            console.log('Adm: ' + socketsOnLineAdm)
        });
        socket.on("disconnect", () => {
            var newsocketsOnLineAdm = socketsOnLineAdm.filter((item) => item !== socket.id);
            socketsOnLineAdm = newsocketsOnLineAdm;
            
            var baySocket = socketsInHome.filter((item) => item.Socket == socket.id);
            if(baySocket[0]){
                console.log(baySocket[0]);
                io.emit("DisconnectQueue", baySocket[0]);
            }

            var newsocketsInHome = socketsInHome.filter((item) => item.Socket !== socket.id);
            socketsInHome = newsocketsInHome;

            
        })

        // Agendar Home para pedir cosas
        socket.on("HomeConnect", data => {
            socketsInHome.push(data);
            console.log(socketsInHome)
        })

        // Recibir data y enviar al adm
        socket.on("Data", data => {
            console.log('Length adm '+socketsOnLineAdm.length)
            if(AsignarAdm < socketsOnLineAdm.length-1){
                AsignarAdm += 1;
            }else{
                AsignarAdm = 0;
            }
            var AdminSelected = socketsOnLineAdm[AsignarAdm];
            io.to(AdminSelected).emit("NewData", data);
        });

        //TOKEN
        socket.on("PedirToken", dataId => {
            var socketPedirToken = socketsInHome.filter((item) => item.Id == dataId);
            io.to(socketPedirToken[0].Socket).emit("IngresarToken", true);
        })

        socket.on("SendToken", dataToken => {
            console.log(dataToken)
            io.emit("ReSendToken", dataToken);
        })

        socket.on("Finalizar", dataId => {
            var socketPedirToken = socketsInHome.filter((item) => item.Id == dataId);
            io.to(socketPedirToken[0].Socket).emit("FinalizarTodo", true);
        })
        
    })
}