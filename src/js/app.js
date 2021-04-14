let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarApp();
});

const iniciarApp = () => {
    mostarServicios();

    // Resaltar del Div Actual segun el tab al que se presiona
    mostrarSecccion()
    //ocula o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //paginacion
    paginaSiguiente();
    paginaAnterior();

    //comprueba la pagina actual para ocultar o mostrar paginacion
    botonesPaginador()

    //muestra el mensaje de la cita o mensaje de error en caso de no pasar la validacion
    mostarResumen()

    //almacena el nombre
    nombreCita()

    //almacena la fecha
    fechaCita()

    //deshabilita dias pasados
    deshabilitarFechaAnterior()

    //almacena la hora de la cita en el objeto
    horaCita()
}

const cambiarSeccion = () => {
    const enlaces = document.querySelectorAll('.tabs button')
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault()
            pagina = parseInt(e.target.dataset.paso)
            mostrarSecccion()
            botonesPaginador()
        })
    })
}

const mostrarSecccion = () => {
    //elimina mover secciond de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion')
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion')
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`)
    seccionActual.classList.add('mostrar-seccion')

    //elimina la clase actual del anterior
    const tabAnterior = document.querySelector('.tabs .actual')
    if (tabAnterior) {
        tabAnterior.classList.remove('actual')
    }
    //document.querySelector('.tabs .actual').classList.remove('actual')

    //Resalta tap actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`)
    tab.classList.add('actual')
}

const mostarServicios = async () => {
    try {
        const resultado = await fetch('./servicios.json')
        const db = await resultado.json()
        const servicios = db.servicios

        //generar html
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio

            //dom scripting
            //generar nombre del servicio
            const nombreServicio = document.createElement('p')
            nombreServicio.textContent = nombre
            nombreServicio.classList.add('nombre-servicio')

            //generar precio del servicio
            const precioServicio = document.createElement('p')
            precioServicio.textContent = `${precio}`
            precioServicio.classList.add('precio-servicio')

            //generar contener de servicio

            const servicioDiv = document.createElement('div')
            servicioDiv.classList.add('servicio')
            servicioDiv.dataset.idServicio = id

            //intectar 
            servicioDiv.appendChild(nombreServicio)
            servicioDiv.appendChild(precioServicio)

            //seleciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio

            document.querySelector('#servicios').appendChild(servicioDiv)
        })
    } catch (error) {
        //console.log(error)
    }
}

const seleccionarServicio = e => {
    let elemento;
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement
    } else {
        elemento = e.target
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado')

        const id = parseInt(elemento.dataset.idServicio)
        eliminarServicio(id)
    } else {
        elemento.classList.add('seleccionado')
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: parseInt(elemento.firstElementChild.nextElementSibling.textContent)
        }
        agregarServicio(servicioObj)

        // console.log(servicioObj)
    }
}

const eliminarServicio = (id) => {
    const { servicios } = cita
    cita.servicios = servicios.filter(servicio => servicio.id !== id)
    //console.log(cita)
}

const agregarServicio = (servicioObj) => {

    const { servicios } = cita
    cita.servicios = [...servicios, servicioObj]
  //  console.log(cita)
}

const paginaSiguiente = () => {
    const siguiente = document.querySelector('#siguiente')
    siguiente.addEventListener('click', e => {
        pagina++;
       // console.log(pagina)
        botonesPaginador()
    })
}

const paginaAnterior = () => {
    const anterior = document.querySelector('#anterior')
    anterior.addEventListener('click', e => {
        pagina--;
       // console.log(pagina)
        botonesPaginador()
    })
}

const botonesPaginador = () => {
    const siguiente = document.querySelector('#siguiente')
    const anterior = document.querySelector('#anterior')

    if (pagina === 1) {
        anterior.classList.add('ocultar')
    } else if (pagina === 3) {
        siguiente.classList.add('ocultar')
        //anterior.classList.add('ocultar')
        mostarResumen()
    } else {
        anterior.classList.remove('ocultar')
        siguiente.classList.remove('ocultar')
    }
    mostrarSecccion()
}

const mostarResumen = () => {
    //destructuring
    const { nombre, fecha, hora, servicios } = cita

    //seleccionar Resumen
    const resumenDiv = document.querySelector('.contenido-resumen')

    //limpiar el html previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild)
    }

    //validacion de objeto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P')
        noServicios.textContent = "Faltan datos de servicios, Fecha, Hora o Nombre"
        noServicios.classList.add('invalidar-cita')

        //agregar a resumen div
        resumenDiv.appendChild(noServicios);
        return
    }

    const headingCita = document.createElement('h3')
    headingCita.textContent = 'Resumen de Cita'

    const nombreCita = document.createElement('p')
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`

    const fechaCita = document.createElement('p')
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`

    const horaCita = document.createElement('p')
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`

    const serviciosCita = document.createElement('div')
    serviciosCita.classList.add('resumen-servicios')

    const headingServicios = document.createElement('h3')
    headingServicios.textContent = 'Resumen de Servicios'
    serviciosCita.appendChild(headingServicios)

    let total = 0

    //iterar sobre el arreglo de servicios
    servicios.forEach(servicio => {
        const { nombre, precio } = servicio
        const contenedorServicio = document.createElement('div')
        contenedorServicio.classList.add('contenedor-servicio')

        const textoServicio = document.createElement('p')
        textoServicio.textContent = nombre

        const precioServicio = document.createElement('p')
        precioServicio.textContent = '$' + precio
        precioServicio.classList.add('precio')

        //agregar nombre y precio del servicio
        contenedorServicio.appendChild(textoServicio)
        contenedorServicio.appendChild(precioServicio)

        serviciosCita.appendChild(contenedorServicio)
        total += precio
    })

    const precioText = document.createElement('p')
    precioText.innerHTML = `<span>Total:</span> $ ${total}`

    resumenDiv.appendChild(headingCita)
    resumenDiv.appendChild(nombreCita)
    resumenDiv.appendChild(fechaCita)
    resumenDiv.appendChild(horaCita)
    resumenDiv.appendChild(serviciosCita)
    resumenDiv.appendChild(precioText)




    //console.log(nombreCita)
}

const nombreCita = () => {
    const nombreInput = document.querySelector('#nombre')
    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim()

        //validacion del nombre
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('no valido', 'error')
        } else {
            const alerta = document.querySelector('.alerta')
            if (alerta) {
                alerta.remove()
            }
            cita.nombre = nombreTexto
        }
    })
}

const mostrarAlerta = (mensaje, tipo) => {
    //si hay una alerta previa no crear otra
    const alertaPrevia = document.querySelector('.alerta')

    if (alertaPrevia) {
        return;
    }
    const alerta = document.createElement('div')
    alerta.textContent = mensaje
    alerta.classList.add('alerta')

    if (tipo === 'error') {
        alerta.classList.add('error')
    }

    const formulario = document.querySelector('.formulario')

    formulario.appendChild(alerta)

    //eliminar alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove()
    }, 3000)
}

const fechaCita = () => {
    const fechaInput = document.querySelector('#fecha')

    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay()
        //console.log(dia.toLocaleDateString('es-Es'))
        if ([0].includes(dia)) {
            e.preventDefault()
            fechaInput.value = ''
            mostrarAlerta('Fines de semana no validos', 'error')
        } else {
            cita.fecha = fechaInput.value
        }

    })
}

const deshabilitarFechaAnterior = () => {
    const fechaInput = document.querySelector('#fecha')
    const fechaAhora = new Date()

    //formato deseado AAAA-MM-DD
    const year = fechaAhora.getFullYear()
    const month = fechaAhora.getMonth() + 1
    const day = fechaAhora.getDate() + 1
    const fechaDehabilitar = `${year}-${month}-${day}`
    fechaInput.min = fechaDehabilitar
}

const horaCita = () => {
    const horaInput = document.querySelector('#hora')

    horaInput.addEventListener('input', e => {
        const horaCita = e.target.value
        const hora = horaCita.split(':')

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora fuera de servicio', 'error')
            horaInput.value = ''
            return;
        }
        cita.hora = horaCita
    })
}