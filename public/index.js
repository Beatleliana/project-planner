/* Funcion que despliega el modal del SIGN IN al hacer click en el boton iniciar sesión*/
function getModalInicio(){

    let modal = document.getElementById("modalSignIn");
    let botonCerrar = document.getElementById("cerrarSignIn");

    // programo el evento: al clickear, abre el modal  
    if (modal.style.display = "none") {
        modal.style.display = "block"
    }
    
    // evento: cierra el modal
    botonCerrar.onclick = () => {
        modal.style.display = "none";
    }

    // evento: si clickea fuera del modal, se cierra
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


/* Funcion que despliega el modal del SIGN UP al hacer click en el boton registrarse*/
function getModalRegistro(){

    let modalInicio = document.getElementById("modalSignIn");

    // evento: al clickear, quito de la vista el modal de inicio
    if (modalInicio.style.display = "block") {
        modalInicio.style.display = "none"
    }

    let modal = document.getElementById("modalSignUp");
    let botonCerrar = document.getElementById("cerrarSignUp");

    // abro el modal de registro
    if (modal.style.display = "none") {
        modal.style.display = "block"
    }

    // evento: cierra el modal
    botonCerrar.onclick = () => {
        modal.style.display = "none";
    }

    // evento: si se clickea fuera del modal, se cierra
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}