const zmq = require('zeromq');

var BD = [{14132441038:"127.0.0.1"},{1497625976:"127.0.0.1"}]
var BDmap = new Map([BD]);

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


function escucharGuardar(){

	var r = zmq.socket('router');

	r.bind('tcp://*:5566');
	
	r.on('message',(hash,ipC)=>{ //escucha en el 5566 para guardar a peers con un video

		BDmap.set(hash,ipC);
	});

}


function escucharBuscar(){
	let s = zmq.socket('router');

	s.bind('tcp://*:5555');

	s.on('message',(hash,ipC)=>{ //escucha en el 5555 para recibir la peticion y devolver los pares con ese video
	
		let ip = BDmap.get(hash);

			s.send(ip);
		});


}



escucharBuscar();
escucharGuardar();