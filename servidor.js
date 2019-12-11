const zmq = require('zeromq');

var BD = [];
var BDmap = new Map([BD]);

BDmap.set(hashName("platano"),["127.0.0.1"]);
BDmap.set(hashName("figura"),["192.168.0.4"]);
BDmap.set(hashName("señor"),["192.168.54.111"]);



console.log(BDmap);
console.log(BDmap.get(hashName("platano")));

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
	console.log("Escuchando para guardar peers");
	r.on('message',(hash,ipC)=>{ //escucha en el 5566 para guardar a peers con un video
		console.log('Guarda peers')
		BDmap.set(hash,ipC);
	});
}


function escucharBuscar(){
	let s = zmq.socket('router');

	s.bind('tcp://*:5555');
	console.log("Escuchando a clientes");
	s.on('message',(cod,sep,hash)=>{ //escucha en el 5555 para recibir la peticion y devolver los pares con ese video
		
			console.log("Mensaje recibido: " + hash);
		
		let h = hashName(hash);
		let ip = BDmap.get(h);
		console.log(ip);
		console.log('dir ip =' + ip)

		s.send(ip);
		console.log('envio dir ip ='+ ip)
	});
}




escucharBuscar();

escucharGuardar();
