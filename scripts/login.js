const usuarioValido = "admin";
const contrasenaValida = "1234";

const formLogin = document.getElementById("formLogin");
const mensajeLogin = document.getElementById("mensajeLogin");

formLogin.addEventListener("submit", function (evento) {

    evento.preventDefault();

    let usuario = document.getElementById("usuario").value;
    let contrasena = document.getElementById("contrasena").value;

    if (
        usuario === usuarioValido &&
        contrasena === contrasenaValida
    ) {

        sessionStorage.setItem("sesionActiva", "true");

        window.location.href = "gestionturnos.html";

    } else {

        mensajeLogin.textContent =
            "Usuario o contraseña incorrectos.";
    }
});