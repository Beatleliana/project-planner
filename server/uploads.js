const fs = require('fs');
const path = require('path');

// Armo una constante de cada directorio de uploads
const tipografiasData = path.join(__dirname, `../public/uploads/${username}/tipografias`);
const referentesData = path.join(__dirname, `../public/uploads/${username}/referentes`);
const paletasData = path.join(__dirname, `../public/uploads/${username}/paletas`);
const bocetosData = path.join(__dirname, `../public/uploads/${username}/bocetos`);


/**
 * Función que consulta y devuelve el array de archivos en la carpeta /referentes
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getTipografias() {
	
	return new Promise((resolve, reject) => {

		fs.readdir(tipografiasData, (err, listaTipografias) => { 
			if (!err) {
				resolve(listaTipografias);
			} else {
				console.log(err);
				reject(`Error ${err.code} en la consulta de archivo: ${err.message}`);
			}
		});
	})
}

/**
 * Función que consulta y devuelve el array de archivos en la carpeta /referentes
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getReferentes() {
	
	return new Promise((resolve, reject) => {

		fs.readdir(referentesData, (err, listaReferentes) => { 
			if (!err) {
				resolve(listaReferentes);
			} else {
				console.log(err);
				reject(`Error ${err.code} en la consulta de archivo: ${err.message}`);
			}
		});
	})
}


/**
 * Función que consulta y devuelve el array de archivos en la carpeta /paletas
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getPaletas() {
    
	return new Promise((resolve, reject) => {

		fs.readdir(paletasData, (err, listaPaletas) => { 
			if (!err) {
				resolve(listaPaletas);
			} else {
				console.log(err);
				reject(`Error ${err.code} en la consulta de archivo: ${err.message}`);
			}
		});
	})
}


/**
 * Función que consulta y devuelve el array de archivos en la carpeta /bocetos
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getBocetos() {
	
	return new Promise((resolve, reject) => {

		fs.readdir(bocetosData, (err, listaBocetos) => { 
			if (!err) {
				resolve(listaBocetos);
			} else {
				console.log(err);
				reject(`Error ${err.code} en la consulta de archivo: ${err.message}`);
			}
		});
	})
}


/**
 * Función que crea un array con todos los archivos, consultando las funciones anteriores de cada carpeta
 * combinando callbacks y promesas
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getAllFiles(success, failure) {

        // Defino una variable que contenga un array con las 4 funciones anteriores que retornan promesas
        let arrayPromesas = [getTipografias(), getReferentes(), getPaletas(), getBocetos()];

        // El Promise.all crea una promesa nueva que se va a resolver cuando se resuelvan todas ok o falle alguna
        Promise.all(arrayPromesas)
          .then( listaDatos => {
            // Si todas salieron bien, devuelvo el array de resultados
            success(listaDatos);
          })
          .catch( mensajeError => {
            // Si hubo alguna falla, ejecuto el cb de error con su mensaje
            failure(mensajeError)
          });
        }

/*Armo el objeto a exportar, q se convertirá en módulo del archivo ppal "server.js" al hacer require de este js.*/
module.exports = { getAllFiles: getAllFiles }