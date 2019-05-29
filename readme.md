# Proyecto Node --> "Proyect Planner"
Proyecto creado para un curso de Node.js
El objetivo es generar una aplicación para gestionar proyectos de diseño, una herramienta que permita a un usuario, crear un proyecto con su respectiva descripción y a su vez pueda subir archivos relevantes a carpetas predefinidas.

# Requerimientos
Node.js, Mongo DB, Node modules (express, multer, express-handlebars).
Los node modules se pueden instalar con el comando en consola npm update.
De Mongo Db, importar (o en su defecto, crear) la base de datos testdb, con la colección users.

# Funcionalidades
1. Logeo y registro de usuario
2. Formulario que cargue descripción del proyecto
3. Subida de archivos a directorios en el disco
4. Visualización de esos archivos

# Branches
1. Master --> sin implementación de sesiones ni base de datos (el usuario es de prueba, está definido manualmente en el código, se valida como user y password: 'admin') pero con la visualización funcionando bien.
2. Test-vistas-uploads --> con implementación de sesiones y base de datos, pero sin la visualización funcionando.

# Problemas para arreglar
1. Mejorar vistas y css que quedaron a medias porque el objetivo prioritario fue implementar conocimientos vistos en el curso de back-end más que nada. Lograr un buen aspecto responsive.
2. Fusionar master y test cuando logre con exito la visualización de los archivos con las sesiones implementadas
3. Optimizar el código, modularizando funciones del archivo principal server.js (quizás con router, pero no me gusta)
4. Implementar la funcionalidad de poder borrar archivos que se subieron


# Algunas funcionalidades posibles propuestas a largo plazo
1. Formulario con listado de tareas propuestas para la realización del proyecto, tipo checklist
2. Incluir un calendario que permite algun tipo de seguimiento
3. Subir archivos a la nube para que el usuario pueda descargarlos en cualquier dispositivo en el que los necesite