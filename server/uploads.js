/*Armo el objeto que se exporta, que se lo que se obtiene como módulo al hacer require de este js.*/
module.exports = {
    getReferentes: getFilesReferentes,
    getTipografias: getFilesTipografias,
    getAllFiles: getAllFiles
}


const fs = require('fs');
const path = require('path');
const directorioReferentes = path.join(__dirname, `../public/uploads/referentes`);
const directorioTipografias = path.join(__dirname, `../public/uploads/tipografias`);


/**
 * Función que consulta y devuelve la lista completa de perros del archivo JSON,
 * sin la información del archivo dogs-info.
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getFilesReferentes(success, failure) {

    fs.readdir(directorioReferentes, function(err, files) { 
        if (!err) {
            success(files);
        } else {
            // Muestro el error por consola para control mío
            console.log(err);
            // Llamo al callback de error y le paso el detalle
            failure(`Error ${err.code} en la consulta de archivo: ${err.message}`);
        }
    });
}


/**
 * Función que consulta y devuelve la lista completa de perros del archivo JSON,
 * sin la información del archivo dogs-info.
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getFilesTipografias(success, failure) {

    fs.readdir(directorioTipografias, function(err, files) { 
        if (!err) {
            success(files);
        } else {
            // Muestro el error por consola para control mío
            console.log(err);
            // Llamo al callback de error y le paso el detalle
            failure(`Error ${err.code} en la consulta de archivo: ${err.message}`);
        }
    });
}


/**
 * Función que consulta y devuelve la lista completa de perros del archivo JSON,
 * sin la información del archivo dogs-info.
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getAllFiles() {

    getFilesReferentes(listaReferentes);
    getFilesTipografias(listaTipografias);
};