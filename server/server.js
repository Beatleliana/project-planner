const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// Middleware para subir y almacenar archivos
const multer = require('multer');
// Generador de vistas
const exphbs = require('express-handlebars');

const fs = require('fs');

// extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// JS propios
const login = require('./login');




// Middleware de body-parser para json
app.use(bodyParser.json());

// Ruta para recursos estáticos.
app.use(express.static(path.join(__dirname, '../public')));



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



// GET al raíz, renderiza un HTML y redirige al home
app.get('/', (req, res) => {
  res.redirect('/home');
});



/* LOGIN */ 

// Declaro variable global vacía que contendrá el nombre del user
var user = "";

// POST /login
app.post('/login', (req, res) => {
  console.log(req.body);
  user = req.body.user;
  if (req.body.user !== undefined && req.body.password !== undefined) {
    if (login.validarUsuario(req.body.user, req.body.password)) {
      res.send('/home');
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(403).end();
  }
});

// GET a /home, renderiza un HTML de home
app.get('/home', (req, res) => {
  res.render('home', {
    title: 'PP - Home',
    user: `<i>${user}</i>`}
  )
});




/* Form de la descripcion proyecto */

// Declaro variable global vacía que contendrá los datos enviados del form
var replyFormDescripcion = "";

// GET a /descripcion, renderiza un HTML de con el objeto de los datos del form
app.get('/descripcion', (req, res) => {
  res.render('descripcion', {datosDescripcion: replyFormDescripcion});
});

// POST del form-proyecto, toma datos enviados por el usuario y los reinterpreta como objeto que se renderiza
app.post('/descripcion', urlencodedParser, (req, res) => {
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
    res.render('subida-archivos', {
        title: 'PP - Subida de archivos',
      });
  });



/* Subida de archivos con multer */

// Declaro una constante con las configuraciones del almacenamiento de uploads
const storage = multer.diskStorage({
  // declaro ruta de destino
  destination: path.join(__dirname, '../public/uploads'),

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

  // Chequeo si ese objeto está vacio o undefined, para renderizar una vista de ok o error
  if(req.files !="" && req.files !=undefined) {
    // Ejecuto un for en ese objeto para recorrerlo
    for(let x = 0; x < req.files.length; x++) {
      console.log("Guardando archivo en la carpeta de destino...")
      
      // el archivo subido a la carpeta general uploads, lo copio en la carpeta definitiva donde se almacena
      fs.createReadStream(`./public/uploads/${req.files[x].filename}`).pipe(fs.createWriteStream(`./public/uploads/referentes/${req.files[x].originalname}`)); 
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

  //opcion 1) res.redirect('/vistareferentes'); ---> si armo una ruta con html y redicciono ahi
  //res.redirect('/vistareferentes');
  //opcion 2) renderizo las imagenes directamente en una vista a la q le paso el array de objetos subidos
    //res.render('galeria', {listaReferentes:req.files})
    
  //opcion 3) Renderizo una vista q toma sus nombres y da mensaje de ok
    res.render('uploadOk', {listaReferentes: req.files})
    } else {
      res.render('error');
    }
})


/* opcion 1) GET que trae la ruta /vistareferentes con la imagen incrustada en html*/
// GET a vistareferentes, que visualiza la imagen subida
app.get('/vistareferentes', function(req, res) {
  // Entra a la ruta del directorio donde estan los archivos subidos
  fs.readdir('./public/uploads/referentes/', function(err, files) {  
      // Creo un html
     var pagina ='<!doctype html><html><head></head><body>';
     // Ejecuto un for para recorrer el array files
     for(var x = 0; x < files.length; x++) {
        // agrego al html, un objeto img con cada objeto del for
         pagina +='<img src="./uploads/referentes/'+files[x]+'"><br>';
     }
     // agrego al html un link de retorno a /subida-archivos
     pagina+='<br><a href="/subida-archivos">Retornar</a></body></html>';
     // envío el html final armado con la imagen de cada array files incrustada
     res.send(pagina);
  });
});




/* TODO: /galeria, vista que muestre en una galeria todas las img subidas del proyecto, de las 4 carpetas */
// GET a galeria, que visualiza las imagenes subidas
app.get('/galeria', function(req, res) {
  
  // Entra a esa ruta del directorio
  fs.readdir(`./public/uploads/referentes`, function(err, files) {  
    console.log(files);
    
    /* 
    // Recorro el array de files
      for (var x = 0; x < files.length; x++){
        var imgReferente = `./uploads/referentes/${files[x]}`;
        console.log(imgReferente);
        //listaReferentes = files;
        //imgReferentes ='<img src="./uploads/referentes/'+files[x]+'"><br>';
        //nombreReferentes = files.filename;
      }
    */

     // renderizo una vista galeria a la que le paso el objeto files de ese directorio
     res.render('galeria', {listaReferentes: files});
  });
});



// POST de /tipografias, repito lo mismo que con el post /referentes, solo cambio el res x redireccion
app.post('/tipografias', upload.array('image'), (req, res) => {
  console.log("entra a /tipografias")
  for(var x = 0; x < req.files.length; x++) {
    console.log("entrar al for de req.files y redirecciona a tipografias")
    //copiamos el archivo a la carpeta definitiva de referentes
   fs.createReadStream('./public/uploads/'+req.files[x].filename).pipe(fs.createWriteStream('./public/uploads/tipografias/'+req.files[x].originalname)); 
   
   console.log("redirecciono y ahora borra el archivo de uploads")
   //borramos el archivo temporal creado
   fs.unlink(('./public/uploads/'+req.files[x].filename), function (err){
     if (err){
       console.log("no se borro el archivo");
     }
     else{
       console.log("se borro con exito")
     }
   } ); 
   console.log("termina el for")
}  
  res.redirect('/vistatipografias');
})


// GET a vistatipografias, que armar un html con el nombre de los archivos subidos
app.get('/vistatipografias', function(req, res) {
  fs.readdir('./public/uploads/tipografias/', function(err, files) {  
     var pagina ='<!doctype html><html><head></head><body>';
     for(var x = 0; x < files.length; x++) {
         pagina +='Subido exitosamente '+files[x]+'<br>';
     }
     pagina+='<br><a href="/subida-archivos">Retornar</a></body></html>';
     res.send(pagina);
  });
});


// POST de /paletas, repito lo mismo que con el post /tipografias
app.post('/paletas', upload.array('image'), (req, res) => {
  console.log("entra a /paletas")
  for(var x = 0; x < req.files.length; x++) {
    console.log("entrar al for de req.files y redirecciona a paletas")
    //copiamos el archivo a la carpeta definitiva de referentes
   fs.createReadStream('./public/uploads/'+req.files[x].filename).pipe(fs.createWriteStream('./public/uploads/paletas/'+req.files[x].originalname)); 
   
   console.log("redirecciono y ahora borra el archivo de uploads")
   //borramos el archivo temporal creado
   fs.unlink(('./public/uploads/'+req.files[x].filename), function (err){
     if (err){
       console.log("no se borro el archivo");
     }
     else{
       console.log("se borro con exito")
     }
   } ); 
   console.log("termina el for")
} 
  res.redirect('/vistapaletas');
})

// GET a vistareferentes, que armar un html con img de los archivos subidos
app.get('/vistapaletas', function(req, res) {
  fs.readdir('./public/uploads/paletas/', function(err, files) {  
     var pagina ='<!doctype html><html><head></head><body>';
     for(var x = 0; x < files.length; x++) {
         pagina +='<img src="./uploads/paletas/'+files[x]+'"><br>';
     }
     pagina+='<br><a href="/subida-archivos">Retornar</a></body></html>';
     res.send(pagina);
  });
});


// POST de /paletas, repito lo mismo que con el post /referentes
app.post('/bocetos', upload.array('image'), (req, res) => {
  console.log("entra a /bocetos")
  for(var x = 0; x < req.files.length; x++) {
    console.log("entrar al for de req.files y redirecciona a bocetos")
    //copiamos el archivo a la carpeta definitiva de referentes
   fs.createReadStream('./public/uploads/'+req.files[x].filename).pipe(fs.createWriteStream('./public/uploads/bocetos/'+req.files[x].originalname)); 
   
   console.log("redirecciono y ahora borra el archivo de uploads")
   //borramos el archivo temporal creado
   fs.unlink(('./public/uploads/'+req.files[x].filename), function (err){
     if (err){
       console.log("no se borro el archivo");
     }
     else{
       console.log("se borro con exito")
     }
   } ); 
   console.log("termina el for")
}  
  res.redirect('/vistabocetos');
})


// GET a /vistabocetos, que arma un html con la img de los archivos subidos
app.get('/vistabocetos', function(req, res) {
  fs.readdir('./public/uploads/bocetos/', function(err, files) {  
     var pagina ='<!doctype html><html><head></head><body>';
     for(var x = 0; x < files.length; x++) {
         pagina +='<img src="./uploads/bocetos/'+files[x]+'"><br>';
     }
     pagina+='<br><a href="/subida-archivos">Retornar</a></body></html>';
     res.send(pagina);
  });
});




// Server iniciado en puerto 4000
app.listen(4000, () => {
  console.log('Escuchando puerto 4000 con Express');
});