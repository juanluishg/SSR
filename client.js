const zmq = require('zeromq'); //importar libreria zeromq
function hashName(name){//Hacer el hash del nombre del video
    var hash = 0, i, chr;
    if (name.length === 0) return hash;
    for (i = 0; i < name.length; i++) {
        chr   = name.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function connectToServer(hash, ipC){//Cliente se conecta al servidor para conocer IP del cliente que tiene el video
    ip = "127.0.0.1";//ip del servidor
    port = "5555";//puerto del servidor
    let s = zmq.socket('req');
    console.log("Conectando...");
    s.connect('tcp://'+ip+":"+port);
    s.send(hash+"//"+ipC); 
    s.on('message',(msg)=>{
        console.log("Recibido");
        var m = new Array(msg)
        console.log(m)
        return m//recibe una lista de las ips de los clientes que tienen el video
        s.close();
    })
}

function connectToClient(hash, ipC){//Cliente se conecta a un cliente  para que le envie el video
    let c = zmq.socket('req');
    console.log("Conectando....");
    c.connect('tcp://'+ipC+":5004")//Ip del cliente que tiene el video
    c.send(hash);
    c.on('message',(msg)=>{
        console.log("Recibido");
        return video;//Recibe el video/parte del video
        c.close();
    })
}


function enviarVideo(hash, ipC){
    let p = zmq.socket('router')
    console.log("Enviando...")
    let reader = new FileReader();
    p.bind("tcp//*:5004")
    p.on('message',(nombreVideo) => {
            var v = nombreVideo;
            if(file_exits(v)){
                var arch = GetObject("/home/juanluishg/Videos/"+v+".avi");
                var leido = reader.readAsArrayBuffer(arch)
                for(let i=0;i<arch.length;i++){p.send(arch[i])}
                p.send("fin");
                console.log("Enviado");
            }
        p.close();
        })
}


/*var nombre = prompt('Introduce el nombre:');
var hash = hashName(nombre);
var ipC=0;
$.post("http://jsonip.appspot.com/",function(data){//conseguir la ip de este pc
    ipC = data.ip;
},"json");
*/
var hash = "hola";
var ipC=0;
var ipsV = connectToServer(hash,ipC);
console.log(ipsV)
if(ipsV.length>0){
    var random = Math.floor(Math.random() * ipsV.length);//se coje un cliente random de la lista de ips que tienen el video
}

var buffer = Buffer.alloc(20);//se reserva memoria para el buffer

buffer = connectToClient(hash, random);