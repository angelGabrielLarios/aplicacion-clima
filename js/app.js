
(() => {
    /* seleccionar formulario */
    const formulario = document.getElementById('formulario')

    /* seleccionar el contenedor para insertar el contenido */
    const climaResultado = document.getElementById('clima-resultado')


    const mostrarLoader = () => {
        limpiarHTML(climaResultado)

        const loaderTemplate =
            `
        <div class="loader justify-content-center">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
        `
        climaResultado.insertAdjacentHTML('beforeend', loaderTemplate)
    }


    const convertirKelvinCentigrado = gradosKelvin => parseInt(gradosKelvin - 273.15)

    const limpiarHTML = referenciaHTML => {
        [...referenciaHTML.children].forEach(element => element.remove())
    }

    const mostrarInfoClimaHTML = data => {

        /* limpiar el html previo */
        limpiarHTML(climaResultado)

        if(data.cod === '404') {
            mostrarAlerta('Lugar no encontrado', 'danger')    
            return
        }
        

        /* realizar dectructuring del objecto */
        const { name, main: { temp, temp_max, temp_min } } = data

        /* realizar las conversiones de grados kelvin a centigrados */
        const tempPromedio = convertirKelvinCentigrado(temp)
        const tempMaxima = convertirKelvinCentigrado(temp_max)
        const tempMinimo = convertirKelvinCentigrado(temp_min)

        /* crear el template html */
        const infoClimaTemplate =
            `
        <div>
            <div class="fw-bold fs-4">
                Clima En: ${name}
            </div>
            <div class="fs-1 fw-bold">
                ${tempPromedio} °C
            </div>

            <div class="fs-5 fw-normal">
                Max: ${tempMaxima} °C
            </div>

            <div class="fs-6 fw-normal">
                Min: ${tempMinimo} °C
            </div>
        </div>
        `

        /* insertar en el html */
        climaResultado.insertAdjacentHTML('beforeend', infoClimaTemplate)

    }

    const getAPIClima = (ciudad, pais) => {

        /* id, de la api para poder utilizarla */
        const appiID = `3522f989017eb4820bdd21e493e3d882`

        /* link, url, para consultar con fetch */
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appiID}`

        mostrarLoader()

        fetch(url)
            .then(request => request.json())
            .then(data => {
                mostrarInfoClimaHTML(data)
                
            })
    }
    const mostrarAlerta = (mensaje, tipo) => {
        const alertaExiste = document.querySelector('.alert-custom')
        if (alertaExiste) return

        const alertaTemplate =
            `
        <div class="alert alert-${tipo} p-2 mt-3 text-center border border-danger alert-custom">
            <b>Error!</b><br>
            ${mensaje}
        </div>
        `

        formulario.insertAdjacentHTML('beforeend', alertaTemplate)

        setTimeout(() => {
            const alerta = document.querySelector('.alert-custom')
            alerta.remove()
        }, 3000);
    }

    const validarFormulario = event => {

        /* prevenir el evento */
        event.preventDefault()

        /* aqui si aplico el metood trim, es un input, que puede escribir el usuario */
        const ciudad = document.getElementById('ciudad').value.trim()

        /* aqui no aplico el metodo trim, porque es un select, y un select solo se escoge una opcion */
        const pais = document.getElementById('pais').value

        /* obtener boolean si tiene un string cualquierad de los campos */
        const tieneStringVacio = [pais, ciudad].includes('')


        /* validar  */
        if (tieneStringVacio) {
            mostrarAlerta('Todos los campos son obligatorios', 'danger')
            return
        }

        /* si no se cumpli el if, hacer los siguiente */

        /* consultar info de la api */
        getAPIClima(ciudad, pais)

    }


    formulario.addEventListener('submit', validarFormulario)




})();