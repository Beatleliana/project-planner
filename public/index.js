/* Función que ejecuta el logueo*/
function doLogin() {
    
    let req = new XMLHttpRequest();
    
    req.onload = function() {
        
        const errorMessageDiv = document.getElementById("error-message");

        if (req.status == 200) {
            window.location.href = req.responseText;
        } else if (req.status == 403) {
            // 403: No autorizado
            errorMessageDiv.textContent = "Usuario/clave incorrectos";
            errorMessageDiv.style.display = "block";
        } else {
            // Otro código HTTP
            errorMessageDiv.textContent = `Error inesperado (código ${request.status})`;
            errorMessageDiv.style.display = "block";
        }
    }
    
    req.open("POST", "/login");
    
    let data = {
        user: document.getElementById("user-id").value,
        password: document.getElementById("password").value
    };
    
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(data));

}


/* Funcion que despliega el modal del SIGN IN al hacer click en el boton iniciar sesión*/
function getModalInicio(){

    let modal = document.getElementById("modalSignIn");
    let botonCerrar = document.getElementById("cerrarSignIn");

    // programamos el evento: al clickear, abre el modal  
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

    // programamos el evento: al clickear, abre el modal  
    if (modalInicio.style.display = "block") {
        modalInicio.style.display = "none"
    }

    let modal = document.getElementById("modalSignUp");
    let botonCerrar = document.getElementById("cerrarSignUp");

    // programamos el evento: al clickear, abre el modal 
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