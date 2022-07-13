# DESAFIO: Balanceo de Carga
# EZEQUIEL PETRONE

Código auto-comentado!

## Comentarios de este dseafío:

La cantidad de Núcleos de mi máquina la calculo en config/config

También en config/config obtengo el modo (fork o cluster) según args (uso YARGS)

La estructura del proyecto es idéntica al entregable anterior, lo único que varía es:

- En server1.js tengo el código que utilizo si quiero levantar el server en modo FORK o modo CLUSTER según args MANUALMENTE! (tiene el IF de cluster.isPrimary, etc...)
Este file lo utilizo cuando quiero ejecutar con Node / Nodemon (o Forever)

- En server2.js tengo el código original, donde por defecto el código levanta un único proceso, ya que el clustering lo manejo externamente.
Este file lo utilizo cuando quiero ejecutarlo con PM2 (o Forever)

## Explicación y comandos:

Decidí balancear la carga entrante a localhost (a través del puerto 80) de la siguiente manera:

Todo lo que es home, login, signup, logout e info, lo balanceo 2/3 en localhost:8080 y 1/3 en localhost:8081

La ruta /api/randoms la balanceo en partes iguales entre localhost:8082 , localhost:8083 , localhost:8084 y localhost:8085

Incluí en la raíz del proyecto el nginx.conf para que vean cómo lo configuré.


Comandos con los que fui jugando para levantar todos los servers en cuestión:

Usando Node levanté el server en localhost:8080 en modo CLUSTER de la siguiente manera:
node server1.js -m CLUSTER

Usando Forever levanté el server en localhost:8081 en modo FORK de la siguiente manera:
forever start server1.js -p 8081

Usando PM2 levanté el server en localhost:8082 y localhost:8083 en modo FORK y el server en modo CLUSTER en localhost:8084 y localhost:8085 de la siguiente manera:
pm2 start server2.js --name="serverA" --watch -- -p 8082
pm2 start server2.js --name="serverB" --watch -- -p 8083
pm2 start server2.js --name="serverC" --watch -i max -- -p 8084
pm2 start server2.js --name="serverD" --watch -i max -- -p 8085

## Comentarios del entregable anterior:

En config/config.js uso DOTENV para setear credenciales de MONGO DB, la cant default de la api que calcula nros random y tiempo de expiración de la sesión Passport según lo que diga el file .env

Además en config/config.js utilizo YARGS para setear el Puerto según parámetro de entrada por CLI.
Se puede usar: -p | --puerto | --port
Ejemplo: node server.js -p 8081

También en config/config.js armo el objeto que utilizo en la ruta '/info' para mostrar información sobre el Node Process. 
El único dato que vale la pena obtenerlo en tiempo real al momento del request es el uso de memoria total (rss), el resto de la data siempre es la mismo una vez iniciado el server.
(Esa vista la dejé como un JSON formateado, si me alcanza el tiempo le hago un html...)

En routes/routes.js el routing de todo lo que es home, login, signup, logout e info.

En routes/apiRouter.js el endpoint que devuelve el cálculo de los nros aleatorios.

La actualización de productos no la manejo con un router sino en paralelo mediante sockets.

En subprocesos/calculo.js está el código del child process que lleva acabo el algoritmo que genera y registra los nros aleatorios (de esta forma el server funciona como NO bloqueante)

Si bien cumple perfectamente con las consignas, me hubiese gustado poder invertirle más tiempo al desafío para:
- GENERAR VISTA HTML A LA RUTA '/INFO' EN VEZ DE QUE SEA UN JSON!