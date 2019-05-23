/*Armo el objeto a exportar, q se convierte en módulo del archivo ppal server.js al hacer require de este js.*/
module.exports = {
    getReferentes: getFilesReferentes,
    getTipografias: getFilesTipografias,
    getAllFiles: getAllFiles
}


const fs = require('fs');


/**
 * Función que consulta y devuelve el array de archivos en la carpeta /referentes
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getFilesReferentes(success, failure) {

    fs.readdir(`../public/uploads/referentes`, (err, listaReferentes) => { 
        if (!err) {
            success(listaReferentes);
        } else {
            // Muestro el error por consola para control mío
            console.log(err);
            // Llamo al callback de error y le paso el detalle
            failure(`Error ${err.code} en la consulta de archivo: ${err.message}`);
        }
    });
}


/**
 * Función que consulta y devuelve el array de archivos en la carpeta /tipografias
 * 
 * @param {function} success Callback para resultado ok
 * @param {function} failure Callback para error
 */
function getFilesTipografias(success, failure) {

    fs.readdir(`../public/uploads/tipografias`, (err, listaTipografias) => { 
        if (!err) {
            success(listaTipografias);
        } else {
            // Muestro el error por consola para control mío
            console.log(err);
            // Llamo al callback de error y le paso el detalle
            failure(`Error ${err.code} en la consulta de archivo: ${err.message}`);
        }
    });
}


/**
 * Función que consulta y devuelve cada una de las carpetas
 */
function getAllFiles(listaReferentes, listaTipografias) {

    getFilesReferentes(listaReferentes);
    getFilesTipografias(listaTipografias);
};


/* 
function getUploadFiles(){

    fs.readdir(`../public/uploads/`, (err, uploads) => { 
        
        uploads.forEach(tipoUpload => {
            fs.readdir(`../public/uploads/${tipoUpload}`, (err, arrayUploads) => {
                arrayUploads.forEach(archivo => {

                })
        }
        )
}
*/