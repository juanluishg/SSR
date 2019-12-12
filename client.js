
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

function connectToServer(hash){//Cliente se conecta al servidor para conocer IP del cliente que tiene el video
    ip = "127.0.0.1";//ip del servidor
    port = "5555";//puerto del servidor
    let s = zmq.socket('req');
    console.log("Conectando...");
    s.connect('tcp://'+ip+":"+port);
    console.log("platano");
    s.send(hash); 
    s.on('message',(msg)=>{
        console.log("Recibido");
        
        let str = ""+msg;
        console.log("Conectando con el peer: "+ msg);
        connectToClient(hash,str)
        
        //recibe una lista de las ips de los clientes que tienen el video
        s.close();
    })

}

function connectToClient(hash, ipC){//Cliente se conecta a un cliente  para que le envie el video
    let c = zmq.socket('req');
    console.log("Conectando...");
    let stri = ""+ipC;
    console.log(hash+" "+stri)
    c.connect('tcp://'+stri+":5004")//Ip del cliente que tiene el video
    c.send([hash,ipC]);
    
    
}


function enviarVideo(hash, ipC){
    let p = zmq.socket('router')
    console.log("Enviando...");
    p.bind("tcp//*:5004")
    p.on('message',(nombreVideo) => {
            var v = nombreVideo;
            if(file_exits(v)){
                convertirVideo(nombreVideo);
                var HLSServer = require('hls-server')
                var http = require('http')
                
                var server = http.createServer()
                var hls = new HLSServer(server, {
                path: '/streams',     // Base URI to output HLS streams
                dir: 'videos'  // Directory that input files are stored
                })
                server.listen(8000);
                console.log("Enviado");
            }
        p.close();
        })
}

/*function convertirVideo(nombre){
    var ffmpeg = require('fluent-ffmpeg')
 
    function callback() { 
        fmpeg(nombre+'.mp4', { timeout: 432000 }).addOptions([
            '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
            '-level 3.0', 
            '-s 640x360',          // 640px width, 360px height output video dimensions
            '-start_number 0',     // start the first .ts segment at index 0
            '-hls_time 10',        // 10 second segment duration
            '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
            '-f hls'               // HLS format
        ]).output('videos/output.m3u8').on('end', callback).run()
    }
}*/

function reproducirVideo(nombreVideo,port=8000) {
    var video = document.getElementById('video');
    if(Hls.isSupported()) {
      var hls = new Hls();
      console.log(hls)
      hls.loadSource('localhost:8000/streams/platano.m3u8');
      console.log("if-------------");
      console.log(hls.src)
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
        video.play();
    });
   }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'localhost:8000/streams/prueba.m3u8';
      console.log(video.src)
      video.addEventListener('loadedmetadata',function() {
        video.play();
      });
    }
}

var ipsV = [];
var nvid = process.argv[2];
var plat = hashName(nvid);
console.log(nvid);
ipsV = connectToServer(nvid);
function f (){
    console.log(ipsV)
    if(ipsV != ""){
        var random = Math.floor(Math.random() * ipsV.length);//se coje un cliente random de la lista de ips que tienen el video
    }
}