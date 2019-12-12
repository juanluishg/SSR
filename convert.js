function convertirVideo(nombre = "platano") {
    var ffmpeg = require('fluent-ffmpeg')
    console.log("funcion")
    function callback() {
        console.log("Dentro del callback")
        ffmpeg("videos/"+nombre + '.mp4', { timeout: 432000 }).addOptions([
            '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
            '-level 3.0',
            '-s 640x360',          // 640px width, 360px height output video dimensions
            '-start_number 0',     // start the first .ts segment at index 0
            '-hls_time 10',        // 10 second segment duration
            '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
            '-f hls'               // HLS format
        ]).output('streams/prueba.m3u8').on('end', callback).run()
        
    }
    callback();
}

convertirVideo("platano")