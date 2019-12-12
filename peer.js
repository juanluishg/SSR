
const zmq = require('zeromq'); //importar libreria zeromq




function hashName(name) {//Hacer el hash del nombre del video
    var hash = 0, i, chr;
    if (name.length === 0) return hash;
    for (i = 0; i < name.length; i++) {
        chr = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function connectToServer(hash, ipC, f) {//Cliente se conecta al servidor para conocer IP del cliente que tiene el video
    ip = "127.0.0.1";//ip del servidor
    port = "5555";//puerto del servidor
    let s = zmq.socket('req');
    console.log("Conectando...");
    s.connect('tcp://' + ip + ":" + port);
    s.send([hash, ipC]);
    s.on('message', (msg) => {
        console.log("Recibido");
        var m = msg;
        console.log(m)
        return m//recibe una lista de las ips de los clientes que tienen el video
        s.close();
    })
    f();
}

function connectToClient(hash, ipC) {//Cliente se conecta a un cliente  para que le envie el video
    let c = zmq.socket('req');
    console.log("Conectando...");
    c.connect('tcp://' + ipC + ":5004")//Ip del cliente que tiene el video
    c.send(hash);
    c.on('message', (msg) => {
        console.log("Recibido");
        return video;//Recibe el video/parte del video
        c.close();
    })
}


function enviarVideo(nombre, ipC) {

    var v = nombre;

    console.log("convirtiendo el video");
    convertirVideo(nombre);
    console.log("video convertido correctamente");
    var HLSServer = require('hls-server')
    var http = require('http')

    var server = http.createServer()
    var hls = new HLSServer(server, {
        path: '/streams',     // Base URI to output HLS streams
        dir: 'videos'  // Directory that input files are stored
    })
    console.log(server);
    server.listen(8000);
    console.log("Enviado");



}

function convertirVideo(nombre) {
    var ffmpeg = require('fluent-ffmpeg')

    function callback() {
        fmpeg(nombre + '.mp4', { timeout: 432000 }).addOptions([
            '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
            '-level 3.0',
            '-s 640x360',          // 640px width, 360px height output video dimensions
            '-start_number 0',     // start the first .ts segment at index 0
            '-hls_time 10',        // 10 second segment duration
            '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
            '-f hls'               // HLS format
        ]).output('videos/prueba.m3u8').on('end', callback).run()
    }
}

function Escuchar() { }
var es = zmq.socket("router");
es.bind("tcp://*:5004");
console.log("Esperando a peticion de cliente");
es.on("message", (c, sep, hash, ipC) => {
    console.log(hash + " " + ipC)

    console.log("peticion de video de " + hash + " recibida, enviando video a " + ipC);
    enviarVideo(hash, ipC);
})



Escuchar();



