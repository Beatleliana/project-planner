const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// Middleware para subir y almacenar archivos
const multer = require('multer');
// Generador de vistas
const exphbs = require('express-handlebars');
// Manejo de sesiones
const expressSession = require('express-session');
const fs = require('fs');


// JS propios
const login = require('./login');
const uploadedFiles = require('./uploads');



// Middleware de body-parser para json
app.use(bodyParser.json());
// extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para recursos estáticos.
app.use(express.static(path.join(__dirname, '../public')));



// Manejo de sesión en Express con opciones bastante default, que no interesa
// ahora profundizar, que definen el comportamiento ante ciertas ocasiones, más
// bien orientadas a cuestiones de seguridad.
app.use(expressSession({
  secret: 'esta propiedad puede tener LITERALMENTE CUALQUIER COSA',
  resave: false,
  saveUninitialized: false
}))



/* Configuramos vistas con Handlebars */

// Acá indicamos el motor, layout (base) default y carpeta de
// ese y otros layouts que hubiera
app.engine('handlebars', exphbs({
  defaultLayout: 'main-layout',
  layoutsDir: path.join(__dirname, '../views/layouts')
}));
// Acá seteamos como motor de renderizado de vistas "handlebars"
app.set('view engine', 'handlebars')
// Y acá seteamos la carpeta para las vistas
app.set('views', path.join(__dirname, '../views'));



// GET a la ruta raíz
app.get('/', (req, res) => {
  // Responde con la página index.html
  res.sendFile(path.join(__dirname, '../public/index.html'));
});




// POST /login, recibo la info del form de logueo
app.post('/login', (req, res) => {
  
  console.log(req.body);

  // Chequeo que el form tenga info en los campos "user" y "password"
  if (req.body.user !== undefined && req.body.password !== undefined) {

    // Si es así, llamo a la función para logear al usuario
    login.loggearUsuario(req.body.user, req.body.password,
      
      // Callback de éxito si validó bien. Guarda la sesión e indica navegar al home
      function() {
        req.session.userId = req.body.user;
        res.redirect('/home');
      },

      // Callback de error si validó mal, se destruye la sesión (si la hubiera) y redirige a página inicial
      function() {
        console.log('Error al validar el usuario');
        req.session.destroy();
        res.redirect('/');
      }
    );
  }
});


// GET logout
app.get('/logout', (req, res) => {

  // Destruyo sesión y redirijo al login.
  req.session.destroy();
  res.redirect("/");

});



// POST /singup, recibo la info del form de registro
app.post('/signup', (req, res) => {

  console.log(req.body);

  // Chequeo que el form tenga info en los campos "user" y "password"
  if (req.body.user !== undefined && req.body.password !== undefined) {
    
    // Si es así, llamo a la función registrar usuario
    login.registrarUsuario(req.body.user, req.body.password,
      
      // Callback de éxito si registró bien. Guarda la sesión e indica navegar al home
      function() {
        req.session.userId = req.body.user;
        res.redirect('/home');
      },
      
      // Callback de error si registró mal, se destruye la sesión (si la hubiera) y redirige al index
      function() {
        console.log('Error al registrar el usuario');
        req.session.destroy();
        res.redirect('/');
      }
    );
  }
})


// GET /home
app.get('/home', (req, res) => {
  
  // Chequeo que haya un usuario logeado para acceder a la ruta
  if (req.session.userId !== undefined) {  

      // Si existe ese usuario, renderizo la home y le paso como dato su nombre
      res.render('home', {
        title: 'PP - Home',
        username: req.session.userId
      });
    
    } else {
        // Caso contrario, redirecciono al index
        res.redirect('/');
      }
  })







/* Form de la descripcion proyecto */

// Declaro variable global vacía que contendrá los datos enviados del form
var replyFormDescripcion = "";

// GET a /descripcion, renderiza un HTML de con el objeto de los datos del form
app.get('/descripcion', (req, res) => {
  
  // Chequeo que haya un usuario logeado para acceder a la ruta
  if (req.session.userId !== undefined) {  
    // Si existe ese usuario, renderizo la vista y le paso como dato su nombre
    res.render('descripcion', {
      datosDescripcion: replyFormDescripcion,
      username: req.session.userId,
    });
  
  } else {
    // Caso contrario, redirecciono al index
    res.redirect('/');
  }
});


// POST del form-proyecto, toma datos enviados por el usuario y los reinterpreta como objeto que se renderiza
app.post('/descripcion', (req, res) => {
  // Chequeo que el request del form no venga vacío o undefined 
  if (req.body != "" && req.body != undefined) {
    // Armo un objeto de respuesta
    replyFormDescripcion = `<i>${req.body.titulo}</i>, creado por ${req.body.autor},<br> 
                Debe entregarse el ${req.body.fecha},<br>
                Tiene como objetivo ${req.body.objetivos},<br>
                Sus condicionantes son ${req.body.condicionantes}`;
    // Renderizo la vista con ese objeto
    res.render('descripcion', {datosDescripcion: replyFormDescripcion})
  }
  else{
    res.render('error');
  }
});



// GET a /subida-archivos, renderiza un HTML con datos que obtiene de un archivo
app.get('/subida-archivos', (req, res) => {
  
  // Chequeo que haya un usuario logeado para acceder a la ruta
  if (req.session.userId !== undefined) {  

    // Si existe ese usuario, renderizo la home y le paso como dato su nombre
    res.render('subida-archivos', {
      title: 'PP - Subida de archivos',
      username: req.session.userId
    });
  } else {
    // Caso contrario, redirecciono al index
    res.redirect('/');
  }
});



/* Subida de archivos con multer */

// Declaro una constante con las configuraciones del almacenamiento de uploads
const storage = multer.diskStorage({
  // declaro ruta de destino
  destination: path.join(__dirname, `../public/uploads/`),

  // defino el nombre del archivo q se guarda, igual al original
  filename: (req, files, callback) => {
    callback(null, files.originalname)},

  // filtro el archivo segun tipo, extensión
  fileFilter: (req, files, callback) => {
    const filetypes = /jpeg|jpg|png|gif|ttf|otf/;
    const mimetype = filetypes.test(files.mimetype);
    const extname = filetypes.test(path.extname(files.originalname));
    if (mimetype && extname) {
      return callback(null, true);
    } else {
      callback("Error: el archivo debe ser jpeg, jpg, png, gif, ttf, otf");
    }
  }
})

// Declaro otra constante para los uploads, que ejecutará multer con las configuraciones de almacenamiento definidas anteriormente
const upload = multer({storage:storage});


// POST /referentes, archivos subidos por el form de referentes
// tomo la variable upload con la propiedad array de multer que permite subir un array de archivos
app.post('/referentes', upload.array('image'), (req, res) => {

  console.log("Subiendo archivo...");
  // Chequeo por consola el objeto que se sube
  console.log(req.files);

  if (req.session.userId !== undefined) {
    
    req.session.userId = username;
    
    fs.mkdir(`./public/uploads/${username}/referentes/`, (err, carpetaUser) => {
      if (!err) {
      resolve(carpetaUser);
      } else {
        console.log(error);
        reject(`Error al crear carpeta referentes de ${username}`)
      }
    });

    // Chequeo si ese objeto está vacio o undefined, para renderizar una vista de ok o error
    if(req.files !="" && req.files !=undefined) {
      // Ejecuto un for en ese objeto para recorrerlo
      for(let x = 0; x < req.files.length; x++) {
        console.log("Guardando archivo en la carpeta de destino...")
        
        // el archivo subido a la carpeta general uploads, lo copio en la carpeta definitiva donde se almacena
        fs.createReadStream(`./public/uploads/${req.files[x].filename}`).pipe(fs.createWriteStream(`./public/uploads/${username}/referentes/${req.files[x].originalname}`)); 
        console.log(`El nombre del archivo es: ${req.files[x].filename}`);
        console.log("Borrando archivo temporal...");
        
        // borro ese archivo temporal subido a la carpeta general
        fs.unlink((`./public/uploads/${req.files[x].filename}`), (err) => {
          if (err){
            console.log("No se borró el archivo temporal");
          }
          else {
            console.log("Se borró el archivo temporal con exito")
          }
        });
      }
    
    // Renderizo una vista q toma sus nombres y da mensaje de ok
      res.render('uploadOk', {listaUploads: req.files})
      } else {
        res.render('error');
      }
    }
})

/* TRATO de hacer una funcion que cree la carpeta del usuario
function crearCarpetaUsuario (cbOk, cbError) {
  
  if (req.session.userId !== undefined) {
     
      req.session.userId = username;
      fs.mkdir(`./public/uploads/${username}/referentes/`, (err, carpetaUser) => {
        if (!err) {
        cbOk(carpetaUser);
        } else {
          console.log(error);
          cbError(`Error al crear carpeta referentes de ${username}`)
        }
      })
    })
  } else {
    cbError("error al ejectuar funcion crearCarpetaUsuario, no existe usuario")
  }
}
*/

// POST /tipografias, archivos subidos por el form de referentes
// Mismo procedimiento que con /referentes
app.post('/tipografias', upload.array('image'), (req, res) => {

  console.log("Subiendo archivo...");
  console.log(req.files);

  if(req.files !="" && req.files !=undefined) {

    for(let x = 0; x < req.files.length; x++) {
      console.log("Guardando archivo en la carpeta de destino...")
      
      // solo cambio la carpeta donde se almacena por uploads/tipografias
      fs.createReadStream(`./public/uploads/${req.files[x].filename}`).pipe(fs.createWriteStream(`./public/uploads/${username}/tipografias/${req.files[x].originalname}`)); 
      console.log(`El nombre del archivo es: ${req.files[x].filename}`);
      console.log("Borrando archivo temporal...");
      
      fs.unlink((`./public/uploads/${req.files[x].filename}`), (err) => {
        if (err){
          console.log("No se borró el archivo temporal");
        }
        else {
          console.log("Se borró el archivo temporal con exito")
        }
      });
    }
    
    res.render('uploadOk', {listaUploads: req.files})
    } else {
      res.render('error');
    }
})



// POST /paletas, archivos subidos por el form de referentes
// Mismo procedimiento que con /referentes
app.post('/paletas', upload.array('image'), (req, res) => {

  console.log("Subiendo archivo...");
  console.log(req.files);

  if(req.files !="" && req.files !=undefined) {

    for(let x = 0; x < req.files.length; x++) {
      console.log("Guardando archivo en la carpeta de destino...")
      
      // solo cambio la carpeta donde se almacena por uploads/paletas
      fs.createReadStream(`./public/uploads/${req.files[x].filename}`).pipe(fs.createWriteStream(`./public/uploads/${username}/paletas/${req.files[x].originalname}`)); 
      console.log(`El nombre del archivo es: ${req.files[x].filename}`);
      console.log("Borrando archivo temporal...");
      
      fs.unlink((`./public/uploads/${req.files[x].filename}`), (err) => {
        if (err){
          console.log("No se borró el archivo temporal");
        }
        else {
          console.log("Se borró el archivo temporal con exito")
        }
      });
    }
    
    res.render('uploadOk', {listaUploads: req.files})
    } else {
      res.render('error');
    }
})



// POST /bocetos, archivos subidos por el form de referentes
// Mismo procedimiento que con /referentes
app.post('/bocetos', upload.array('image'), (req, res) => {

  console.log("Subiendo archivo...");
  console.log(req.files);

  if(req.files !="" && req.files !=undefined) {

    for(let x = 0; x < req.files.length; x++) {
      console.log("Guardando archivo en la carpeta de destino...")
      
      // solo cambio la carpeta donde se almacena por uploads/bocetos
      fs.createReadStream(`./public/uploads/${req.files[x].filename}`).pipe(fs.createWriteStream(`./public/uploads/${username}/bocetos/${req.files[x].originalname}`)); 
      console.log(`El nombre del archivo es: ${req.files[x].filename}`);
      console.log("Borrando archivo temporal...");
      
      fs.unlink((`./public/uploads/${req.files[x].filename}`), (err) => {
        if (err){
          console.log("No se borró el archivo temporal");
        }
        else {
          console.log("Se borró el archivo temporal con exito")
        }
      });
    }
    
    res.render('uploadOk', {listaUploads: req.files})
    } else {
      res.render('error');
    }
})



// GET a galeria, que visualiza todas las imagenes subidas, de las 4 carpetas
app.get('/galeria', (req, res) => {

  // Chequeo que un usuario esté logeado para acceder a la ruta
  if (req.session.userId !== undefined) {  
  
    // Llamo a la función modulo para traerme todos los archivos
    uploadedFiles.getAllFiles(
      // Tomo el resultado que es un array con los archivos de cada carpeta, su índice 0, 1, 2, 3, corresponde a cada una de estas
      listaDatos => {
        // Renderizo una vista a la que le paso como objeto ese array, indicando el índice segun la carpeta deseada
        res.render ('galeria', {
          username: req.session.userId,
          tipografias: listaDatos[0],
          referentes: listaDatos[1],
          paletas: listaDatos[2],
          bocetos: listaDatos[3]
        })
      },

      mensajeError => {
        mensajeError(`Error ${err.code} en la consulta de archivo: ${err.message}`);
        // Tiro msj x consola si hay error
        console.log(err);
        // Renderizo vista de error, llamo al callback correspondiente y su mensaje
        res.render ('errorGaleria' , {
          error: mensajeError
        });
      }
    );
  } else {
    // Caso contrario, redirecciono al index
    res.redirect('/');
  }

})



// Server iniciado en puerto 4000
app.listen(4000, () => {
  console.log('Escuchando puerto 4000 con Express');
});