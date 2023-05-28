document.addEventListener('DOMContentLoaded', function() {
    obtenerArchivosGuardados();
});

document.querySelector('#crearForm').addEventListener("submit", function(event) {
    let nombreArchivo = document.getElementById('fileName').value

    document.querySelector('#vistaPrevia').style.visibility="visible"
    document.querySelector('#nombreArchivo').innerHTML = nombreArchivo
    event.preventDefault();
})

document.getElementById('markupText').addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const text = document.querySelector('#markupText')
    document.querySelector('#markupForm').onsubmit = () => {
        convertirTexto(text.value)
        document.getElementById("convertidoForm").style.display="block";
        return false;
    }
})


document.querySelector('#guardarArchivo').addEventListener("click", function(event) {
    event.preventDefault();
    guardarArchivo();
});

function convertirTexto(markupText) {
    const url = 'http://localhost:3000/'
    const data = {
        text: markupText
    }
    console.log(data)

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }
    http = fetch(url, request)
    http.then(
        response => response.json()
    ).then(
        data => {
            document.querySelector("#htmlCode").innerHTML = data.text
        }
    )
}

function guardarArchivo() {

    const nombreArchivo = document.querySelector('#nombreArchivo').innerHTML;
    const titulo = "<h3>" + nombreArchivo + "</h3>";
    const htmlCode = titulo + document.querySelector('#htmlCode').innerHTML;

    const data = {
        nombreArchivo: nombreArchivo,
        htmlText: htmlCode
    };

    fetch('/guardar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        obtenerArchivosGuardados(); //funcion agregada
    })
    .catch(error => {
        console.error('Error al guardar el archivo:', error);
        alert('Error al guardar el archivo');
    });
}

function obtenerArchivosGuardados() {
    fetch('/obtenerArchivos')
        .then(response => response.json())
        .then(data => {
            const archivosGuardados = document.querySelector('#archivosGuardados');
            archivosGuardados.innerHTML = '';

            data.forEach(archivo => {
                const listItem = document.createElement('li');
                listItem.textContent = archivo;
                archivosGuardados.appendChild(listItem);

                listItem.addEventListener('click', function() {
                    mostrarArchivo(this.textContent);
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener archivos guardados:', error);
        });
}

function mostrarArchivo(nombreArchivo) {
    fetch(`/archivos/${nombreArchivo}`)
        .then(response => response.text())
        .then(data => {
            const vistaPrevia = document.querySelector('#vistaPrevia');
    
            vistaPrevia.innerHTML = data;
            vistaPrevia.style.visibility = 'visible';
        })
        .catch(error => {
            console.error('Error al cargar el archivo:', error);
        });
}