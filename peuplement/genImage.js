const { createCanvas } = require('canvas');
const fs = require('fs');

function createRandomImage(width, height, nbImg) {
    let cpt = 0;

    while (cpt < nbImg) {
        cpt++;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        const stream = canvas.pngStream();
        const out = fs.createWriteStream(__dirname + '/image' + cpt + ".png");
        stream.on('data', function(chunk) {
            out.write(chunk); // On écrit le stream à un chemin précedemment défini
        });
        stream.on('end', function() {});
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                ctx.fillStyle = getRndColor(); // set random color
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

function getRndColor() {
    var r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
createRandomImage(500, 500, 10);