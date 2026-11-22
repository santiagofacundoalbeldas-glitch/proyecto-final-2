if (sessionStorage.getItem("sesionActiva") !== "true") {
    window.location.href = "login.html";
}

const tablaTurnos = document.getElementById("tablaTurnos");

const formularioGestion = document.getElementById("formularioGestion");
const formGestionTurno = document.getElementById("formGestionTurno");

const tituloFormulario = document.getElementById("tituloFormulario");

const buscarDNI = document.getElementById("buscarDNI");

const btnNuevoTurno = document.getElementById("btnNuevoTurno");
const btnBuscar = document.getElementById("btnBuscar");
const btnMostrarTodos = document.getElementById("btnMostrarTodos");

const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const btnCancelarFormulario = document.getElementById("btnCancelarFormulario");

function mostrarTurnos(listaTurnos) {

    let cuerpoTabla = tablaTurnos.querySelector("tbody");

    if (cuerpoTabla == null) {
        cuerpoTabla = document.createElement("tbody");
        tablaTurnos.appendChild(cuerpoTabla);
    }

    cuerpoTabla.replaceChildren();

    for (let i = 0; i < listaTurnos.length; i++) {

        let turno = listaTurnos[i];

        let fila = document.createElement("tr");

        let paciente = sistema.buscarPaciente(turno.dniPaciente);

        let nombrePaciente = "Paciente no encontrado";

        if (paciente != null) {
            nombrePaciente = paciente.nombre + " " + paciente.apellido;
        }

        let datos = [
            turno.id,
            turno.dniPaciente,
            nombrePaciente,
            turno.tipoAtencion,
            turno.especialidad,
            turno.fecha,
            turno.hora,
            turno.estado
        ];

        for (let j = 0; j < datos.length; j++) {

            let celda = document.createElement("td");

            celda.textContent = datos[j];

            fila.appendChild(celda);
        }

        let celdaAcciones = document.createElement("td");

        let btnModificar = document.createElement("button");

        btnModificar.textContent = "Modificar";

        btnModificar.addEventListener("click", function () {
            cargarFormulario(turno);
        });

        celdaAcciones.appendChild(btnModificar);

        if (turno.estado !== "Cancelado") {

            let btnCancelar = document.createElement("button");

            btnCancelar.textContent = "Cancelar";

            btnCancelar.addEventListener("click", function () {

                if (confirm("¿Desea cancelar este turno?")) {

                    sistema.cancelarTurno(turno.id);

                    mostrarTurnos(sistema.listarTurnos());
                }
            });

            celdaAcciones.appendChild(btnCancelar);
        }

        let btnEliminar = document.createElement("button");

        btnEliminar.textContent = "Eliminar";

        btnEliminar.addEventListener("click", function () {

            if (confirm("¿Desea eliminar definitivamente este turno?")) {

                sistema.eliminarTurno(turno.id);

                mostrarTurnos(sistema.listarTurnos());
            }
        });

        celdaAcciones.appendChild(btnEliminar);

        fila.appendChild(celdaAcciones);

        cuerpoTabla.appendChild(fila);
    }
}

btnNuevoTurno.addEventListener("click", function () {

    formGestionTurno.reset();

    document.getElementById("idTurno").value = "";

    tituloFormulario.textContent = "Registrar nuevo turno";

    formularioGestion.hidden = false;
});

function cargarFormulario(turno) {

    document.getElementById("idTurno").value = turno.id;

    document.getElementById("dniGestion").value = turno.dniPaciente;

    document.getElementById("tipoGestion").value =
        turno.tipoAtencion;

    document.getElementById("especialidadGestion").value =
        turno.especialidad;

    document.getElementById("fechaGestion").value =
        turno.fecha;

    document.getElementById("horaGestion").value =
        turno.hora;

    tituloFormulario.textContent = "Modificar turno";

    formularioGestion.hidden = false;
}

formGestionTurno.addEventListener("submit", function (evento) {

    evento.preventDefault();

    let id = document.getElementById("idTurno").value;

    let dni = document.getElementById("dniGestion").value.trim();

    let tipoAtencion = document.getElementById("tipoGestion").value;

    let especialidad =
        document.getElementById("especialidadGestion").value;

    let fecha = document.getElementById("fechaGestion").value;

    let hora = document.getElementById("horaGestion").value;

    let paciente = sistema.buscarPaciente(dni);

    if (paciente == null) {

        alert("No existe un paciente registrado con ese DNI.");

        return;
    }

    if (
        dni === "" ||
        tipoAtencion === "" ||
        especialidad === "" ||
        fecha === "" ||
        hora === ""
    ) {

        alert("Complete todos los campos.");

        return;
    }


    let fechaSeleccionada = new Date(fecha + "T00:00:00");
    let fechaActual = new Date();

    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {

        alert("No puede seleccionar una fecha pasada.");

        return;
    }


    let nuevosDatos = {
        tipoAtencion: tipoAtencion,
        especialidad: especialidad,
        fecha: fecha,
        hora: hora
    };


    if (id === "") {


        let nuevoTurno = new Turno(
            sistema.generarID(),
            dni,
            tipoAtencion,
            especialidad,
            fecha,
            hora
        );

        if (sistema.registrarTurno(nuevoTurno)) {

            alert("Turno registrado correctamente.");

        } else {

            alert("El horario seleccionado ya está ocupado.");

            return;
        }

    } else {

        let turno = sistema.buscarTurno(Number(id));

        if (turno == null) {

            alert("No se encontró el turno.");

            return;
        }

        if (turno.estado === "Cancelado") {

            alert("No se puede modificar un turno cancelado.");

            return;
        }

        if (turno.dniPaciente !== dni) {

            alert("No se puede cambiar el paciente de un turno existente.");

            return;
        }

        if (sistema.modificarTurno(Number(id), nuevosDatos)) {

            alert("Turno modificado correctamente.");

        } else {

            alert("El nuevo horario seleccionado ya está ocupado.");

            return;
        }
    }


    formularioGestion.hidden = true;

    formGestionTurno.reset();

    mostrarTurnos(sistema.listarTurnos());
});

btnCancelarFormulario.addEventListener("click", function () {

    formularioGestion.hidden = true;

    formGestionTurno.reset();
});

btnBuscar.addEventListener("click", function () {

    let dni = buscarDNI.value.trim();

    if (dni === "") {

        alert("Ingrese un DNI para realizar la búsqueda.");

        return;
    }

    let resultado = sistema.listarTurnosPorDNI(dni);

    mostrarTurnos(resultado);
});

btnMostrarTodos.addEventListener("click", function () {

    buscarDNI.value = "";

    mostrarTurnos(sistema.listarTurnos());
});

btnCerrarSesion.addEventListener("click", function () {

    sessionStorage.removeItem("sesionActiva");

    window.location.href = "login.html";
});

mostrarTurnos(sistema.listarTurnos());