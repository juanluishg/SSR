# SSR
Aplicacion P2P de streaming almacenado

Presentación: 

https://docs.google.com/presentation/d/1eC_EYhMo3abJ3Fpqwx5gOmytDvWQ3Qp1hJHTiXM0IQ8/edit?usp=sharing


## Instrucciones de uso

- Descargar este repositorio
```plain
git clone https://github.com/juanluishg/SSR.git
```
- Instalar nodejs y npm
```plain
apt install nodejs npm
```

- Instalar la libreria ZeroMQ, hls-server y fluent-ffmpeg
```plain
npm i zeromq@5
npm i hls-server
npm i fluent-ffmpeg
```

- Ejecutar primero el servidor.js
```plain
node servidor
```

- Ejecutar segundo peer.js
```plain
node peer
```

- Ejecutar tercero client.js + el nombre del video
```plain
node client platano
```

- Abrir VLC y añadir como ubicacion de red la direccion ip del peer y el video que queramos ver
```plain
http://localhost:8000/streams/platano.m3u8
```
