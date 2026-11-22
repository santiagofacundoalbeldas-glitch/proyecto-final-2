class turno{
    constructor(codigo, fecha, tipo, dnipaciente){
        this.codigo = codigo;
        this.fecha = fecha;
        this.tipo = tipo;
        this.dnipaciente = dnipaciente;
    }
    getcodigo(){
        return this.codigo;
    }
    getfecha(){
        return this.fecha;
    }
    gettipo(){
        return this.tipo;
    }
    getdnipaciente(){
        return this.dnipaciente;
    }
    setcodigo(nuevocodigo){
        this.codigo = nuevocodigo;
    }
    setfecha(nuevafecha){
        this.fecha = nuevafecha;
    }
    settipo(nuevotipo){
        this.tipo = nuevotipo;
    }
    setdnipaciente(nuevodnipaciente){
        this.dnipaciente = nuevodnipaciente;
    }
   toString(){
        return ("codigo:" + this.codigo + ", fecha:" + this.fecha + ", tipo:" + this.tipo + ", dnipaciente" + this.dnipaciente);
    }
}
class paciente {
    constructor(nombre, apellido, dni, Edad, telefono, sexo){
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.Edad = Edad;
        this.telefono = telefono;
        this.sexo = sexo;
    }
    getnombre(){
        return this.nombre;
    }
    getapellido(){
        return this.apellido;
    }
    getdni(){
        return this.dni;
    }
    getedad(){
        return this.Edad;
    }
    gettelefono(){
        return this.telefono;
    }
    getsexo(){
        return this.sexo;
    }
    setnombre(nuevonombre){
        this.nombre = nuevonombre;
    }
    setapellido(nuevoapellido){
        this.apellido = nuevoapellido;
    }
    setdni(nuevodni){
        this.dni = nuevodni;
    }
    setedad(nuevaedad){
        this.Edad = nuevaedad;
    }
    settelefono(nuevotelefono){
        this.telefono = nuevotelefono;
    }
    setsexo(nuevosexo){
        this.sexo = nuevosexo;
    }
    toString(){
        return ("nombre:" + this.nombre + ", apellido:" + this.apellido + ", dni:" + this.dni + ", edad:" + this.Edad + ", telefono:" + this.telefono + ", sexo:" + this.sexo);
    }
}
class sistematurno{
    constructor(){
        this.pacientes=[];
        this.turnos=[];
        this.cargarDatos();
    }

cargarDatos(){
    let paciente = localStorage.getItem("pacientes");
    let turno  = localStorage.getItem("turnos");
    if(paciente!=null){
        this.pacientes = JSON.parse(paciente);
    }
    if(turno!=null){
        this.turnos = JSON.parse(turno);
    }
    }

guardarDatos(){
    localStorage.setItem("pacientes", JSON.stringify(this.pacientes));
    localStorage.setItem("turnos", JSON.stringify(this.turnos));
}

buscarpaciente(dni){
    for(i=0; i<this.pacientes.length; i++){
        if(this.pacientes[i].getdni()==dni){
            return this.pacientes[i];
        }
    }
    return null;
}

buscarturno(codigo){
    for(i=0; i<this.turnos.length; i++){
        if(this.turnos[i].getcodigo()==codigo){
            return this.turnos[i];
        }
    }
    return null;
}

listaturnos(){
    return this.turnos;
}

listarturnospordni(dni){
    let resultado = [];
    for(i=0; i<this.turnos.length; i++){
        if(this.turnos[i].getdnipaciente()==dni)
        {
            resultado.push(this.turnos[i]);
        }
    }
return resultado;
}

horariodisponible(tipo, fecha, idexcluir = null){
    for(let i=0; i<this.turnos.length; i++){
        let tActual = this.turnos[i];
        if(tActual.getcodigo() != idexcluir && tActual.gettipo() == tipo && tActual.getfecha()== fecha){
            return false;
        }
    }
    return true;
}

registrarturno(turno){
    if(!this.horariodisponible(turno.gettipo(), turno.getfecha())){
        return false;   
    }
    this.turnos.push(turno);
    this.guardarDatos();
    return true;
}
cancelarTurno(codigo) {

        let turno = this.buscarTurno(codigo);

        if (turno == null || turno.estado === "Cancelado") {
            return false;
        }

        turno.estado = "Cancelado";
        this.guardarDatos();

        return true;
    }


modificarTurno(codigo, nuevosDatos) {

    let turno = this.buscarTurno(id);

    if (turno == null) {
        return false;
    }

    if (
        !this.horarioDisponible(
            nuevosDatos.especialidad,
            nuevosDatos.fecha,
            codigo
        )
    ) {
        return false;
    }

    turno.tipoAtencion = nuevosDatos.tipoAtencion;
    turno.especialidad = nuevosDatos.especialidad;
    turno.fecha = nuevosDatos.fecha;

    this.guardarDatos();

    return true;
}


eliminarTurno(codigo) {

    for (let i = 0; i < this.turnos.length; i++) {

        if (this.turnos[i].id === id) {

            this.turnos.splice(i, 1);
            this.guardarDatos();

            return true;
        }
    }

    return false;
}


generarID() {

    let mayorID = 0;

    for (let i = 0; i < this.turnos.length; i++) {

        if (this.turnos[i].id > mayorID) {
            mayorID = this.turnos[i].id;
        }
    }

    return mayorID + 1;
}
}
const sistema = new SistemaTurnos();