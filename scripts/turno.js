const formPaciente = document.getElementById("formPaciente");
const registroPaciente = document.getElementById("registroPaciente");
const solicitudTurno = document.getElementById("solicitudTurno");

const formRegistroPaciente = document.getElementById("formRegistroPaciente");
const formTurno = document.getElementById("formTurno");

const confirmacionTurno = document.getElementById("confirmacionTurno");
const resumenTurno = document.getElementById("resumenTurno");

const mensajePaciente = document.getElementById("mensajePaciente");
const mensajeTurno = document.getElementById("mensajeTurno");

const formCancelar = document.getElementById("formCancelar");
const listaTurnosPaciente = document.getElementById("listaTurnosPaciente");

let pacienteActual = null;
let datosNuevoTurno = null;

formPaciente.addEventListener("submit", function (evento) {

    evento.preventDefault();

    let dni = document.getElementById("dni").value.trim();

    if (dni === "") {
        mensajePaciente.textContent = "Ingrese un DNI.";
        return;
    }

    pacienteActual = sistema.buscarPaciente(dni);

    if (pacienteActual != null) {

        mensajePaciente.textContent =
            "Paciente encontrado: " +
            pacienteActual.nombre + " " +
            pacienteActual.apellido;

        registroPaciente.hidden = true;
        solicitudTurno.hidden = false;

    } else {

        mensajePaciente.textContent =
            "No se encontró un paciente con ese DNI. Complete sus datos.";

        registroPaciente.hidden = false;
        solicitudTurno.hidden = true;

        document.getElementById("dniRegistro").value = dni;
    }
});

formRegistroPaciente.addEventListener("submit", function (evento) {

    evento.preventDefault();

    let dni = document.getElementById("dniRegistro").value.trim();
    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let correo = document.getElementById("correo").value.trim();

    if (dni === "" || nombre === "" || apellido === "") {
        alert("Complete los datos obligatorios.");
        return;
    }

    let nuevoPaciente = new Paciente(
        dni,
        nombre,
        apellido,
        telefono,
        correo
    );

    if (sistema.registrarPaciente(nuevoPaciente)) {

        pacienteActual = nuevoPaciente;

        alert("Paciente registrado correctamente.");

        registroPaciente.hidden = true;
        solicitudTurno.hidden = false;

    } else {

        alert("Ya existe un paciente registrado con ese DNI.");
    }
});

formTurno.addEventListener("submit", function (evento) {

    evento.preventDefault();

    let tipoAtencion = document.getElementById("tipoAtencion").value;
    let especialidad = document.getElementById("especialidad").value;
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;

    if (
        tipoAtencion === "" ||
        especialidad === "" ||
        fecha === "" ||
        hora === ""
    ) {
        mensajeTurno.textContent = "Complete todos los campos.";
        return;
    }

    let fechaSeleccionada = new Date(fecha + "T00:00:00");
    let fechaActual = new Date();

    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
        mensajeTurno.textContent = "No puede seleccionar una fecha pasada.";
        return;
    }

    if (!sistema.horarioDisponible(especialidad, fecha, hora)) {
        mensajeTurno.textContent =
            "El horario seleccionado ya se encuentra ocupado.";
        return;
    }

    datosNuevoTurno = {
        tipoAtencion: tipoAtencion,
        especialidad: especialidad,
        fecha: fecha,
        hora: hora
    };

    mostrarConfirmacion();
});

function mostrarConfirmacion() {

    resumenTurno.textContent =
        "Paciente: " + pacienteActual.nombre + " " +
        pacienteActual.apellido +
        " | DNI: " + pacienteActual.dni +
        " | Atención: " + datosNuevoTurno.tipoAtencion +
        " | Especialidad: " + datosNuevoTurno.especialidad +
        " | Fecha: " + datosNuevoTurno.fecha +
        " | Hora: " + datosNuevoTurno.hora;

    solicitudTurno.hidden = true;
    confirmacionTurno.hidden = false;
}

document.getElementById("btnConfirmar").addEventListener("click", function () {

    let nuevoTurno = new Turno(
        sistema.generarID(),
        pacienteActual.dni,
        datosNuevoTurno.tipoAtencion,
        datosNuevoTurno.especialidad,
        datosNuevoTurno.fecha,
        datosNuevoTurno.hora
    );

    if (sistema.registrarTurno(nuevoTurno)) {

        alert("Turno registrado correctamente.");

        formTurno.reset();

        confirmacionTurno.hidden = true;
        solicitudTurno.hidden = false;

        mensajeTurno.textContent = "";

        datosNuevoTurno = null;

    } else {

        alert("El horario ya no se encuentra disponible.");
    }
});

document.getElementById("btnVolver").addEventListener("click", function () {

    confirmacionTurno.hidden = true;
    solicitudTurno.hidden = false;
});

formCancelar.addEventListener("submit", function (evento) {

    evento.preventDefault();

    let dni = document.getElementById("dniCancelar").value.trim();

    let turnosPaciente = sistema.listarTurnosPorDNI(dni);

    listaTurnosPaciente.replaceChildren();

    if (turnosPaciente.length === 0) {

        listaTurnosPaciente.textContent =
            "No se encontraron turnos para ese DNI.";

        return;
    }

    for (let i = 0; i < turnosPaciente.length; i++) {

        let turno = turnosPaciente[i];

        let contenedor = document.createElement("div");
        let informacion = document.createElement("p");

        informacion.textContent =
            "Turno N° " + turno.id +
            " | " + turno.especialidad +
            " | " + turno.fecha +
            " | " + turno.hora +
            " | Estado: " + turno.estado;

        contenedor.appendChild(informacion);

        if (turno.estado !== "Cancelado") {

            let botonCancelar = document.createElement("button");

            botonCancelar.textContent = "Cancelar turno";

            botonCancelar.addEventListener("click", function () {

                if (confirm("¿Está seguro de cancelar este turno?")) {

                    sistema.cancelarTurno(turno.id);

                    alert("Turno cancelado correctamente.");

                    formCancelar.requestSubmit();
                }
            });

            contenedor.appendChild(botonCancelar);
        }

        listaTurnosPaciente.appendChild(contenedor);
    }
});