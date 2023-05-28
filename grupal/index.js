const fs = require('fs')
const path = require('path')
const express = require('express')
const bp = require('body-parser')
const MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();
const app = express()

app.use(express.static('pub'))
app.use(bp.json())
app.use(bp.urlencoded({
    extended: true
}))

app.listen(3000, () => {
    console.log("Escuchando en: http://localhost:3000")
})

app.get('/', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'index.html'))
})

app.post('/', (request, response) => {
    console.log(request.body)
    var markDownText = request.body.text
    console.log(markDownText)
    var htmlText = md.render(markDownText)
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({
        text: htmlText
    }))
})

app.post('/guardar', (request, response) => {
    const fileName = request.body.nombreArchivo;
    const htmlText = request.body.htmlText;

    const filePath = path.join(__dirname, 'pub/markdowns', fileName + '.html');
    
    fs.writeFile(filePath, htmlText, (error) => {
        if (error) {
            console.error('Error al guardar el archivo:', error);
            response.status(500).json({ error: 'Error al guardar el archivo' });
            return;
        }
        console.log('Archivo guardado exitosamente:', filePath);
        response.status(200).json({ message: 'Archivo guardado exitosamente' });
    });
});

app.get('/obtenerArchivos', (request, response) => {
    const directorioArchivos = path.join(__dirname, 'pub/markdowns');
    fs.readdir(directorioArchivos, (error, archivos) => {
        if (error) {
            console.error('Error al leer el directorio:', error);
            response.status(500).json({ error: 'Error al obtener la lista de archivos' });
            return;
        }
        const archivosHTML = archivos.filter(archivo => archivo.endsWith('.html'));
        response.status(200).json(archivosHTML);
    });
});

app.get('/archivos/:nombreArchivo', (request, response) => {
    const fileName = request.params.nombreArchivo;
    const filePath = path.join(__dirname, 'pub/markdowns', fileName);
    
    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        console.error('Error al leer el archivo:', error);
        response.status(500).json({ error: 'Error al obtener el archivo' });
        return;
      }
      response.status(200).send(data);
    });
});