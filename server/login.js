const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const dbURL = "mongodb://localhost:27017"


/**
 * Función que valida usuario y clave
 * 
 * @param {string} user Usuario
 * @param {string} password Clave
 * @param {function} cbOK Callback de exito
 * @param {function} cbErr Callback de error
 */
function loggearUsuario(user, password, cbOK, cbErr) {

  // Se conecta al motor de base de datos
  MongoClient.connect(dbURL, { useNewUrlParser: true }, (err, client) => {

    // Trae referencia a la base
    const db = client.db("testdb");

    // Trae referencia a la colección
    const collUser = db.collection("users");

    // Busco todos los documentos en la colección que coincidan con el criterio de username y password enviados
    collUser.find( {username: user, password: password }).toArray((err, data) => {
      
      if (data.length == 1) {
        // Si encontró un solo registro con ese usuario y clave, invoco al callback de éxito
        cbOK();
      } else {
       // Si encontró uno o más (usuario duplicado por error), llamo al callback de error
        cbErr();
      }
      
      client.close();
    })
  })
}



/**
 * Función que registra un nuevo usuario
 * 
 * @param {string} user Usuario
 * @param {string} password Clave
 * @param {function} cbOK Callback de exito
 * @param {function} cbErr Callback de error
 * @param {function} cbVacio Callback de error si no se enviaron datos
 */
function registrarUsuario(user, password, cbOK, cbErr, cbVacio) {
  
  // Se conecta al motor de base de datos
  MongoClient.connect(dbURL, { useNewUrlParser: true }, (err, client) => {

    // Trae referencia a la base
    const db = client.db("testdb");

    // Trae referencia a la colección
    const collUser = db.collection("users");

    // Chequeo que los datos enviados contengan información
    if(user != undefined || user != '' && password != ''|| password != undefined) {
      
      // Busco todos los documentos en la colección que coincidan con el criterio de username y password enviados
      collUser.find( {username: user, password: password }).toArray((err, data) => {
        
        if (data.length == 0) {
          // Si no encontró un registro con ese usuario y clave, invoco al callback de exito
          collUser.insertOne({
            username : user,
            password : password,
            
          })
          cbOK();
          client.close()

        } else {
          // Si encontró uno o más (usuario duplicado por error), llamo al callback de error
          cbErr();
          client.close()
        }
      })
    
    } else {
      // Si no se enviaron datos de usuario, llamo a otro callback de error
      cbVacio();
      client.close()
    }
  })
}


module.exports.loggearUsuario = loggearUsuario;
module.exports.registrarUsuario = registrarUsuario;