// Importo DOTENV
require('dotenv').config()

// Importo y utilizo YARGS
const yargs = require('yargs/yargs')(process.argv.slice(2));

const argv = yargs.alias({ p: "port", m: "mode" }).alias({ p: "puerto", m: "modo" }).default({ p: 8080, m: "FORK" }).argv;

delete argv.$0 //Elimino el atributo por defecto que contiene el nombre del file

const numCPUs = require('os').cpus().length // Calculo qty de núcleos del proc

//Armo objeto con info relevante del Node Process
const info = {
  argumentos_entrada: process.argv.slice(2),
  argumentos_entrada_yargs: argv,
  plataforma: process.platform,
  path_ejec: process.execPath,
  node_version: process.version,
  pid: process.pid,
  carpeta_proyecto: process.cwd(),
  numCPUs: numCPUs
  // rss: process.memoryUsage().rss //Esto particularmente me conviene calcularlo dinámicamente por cada request
}

module.exports = {
  MONGO_URL: process.env.MONGO_URL || '',
  PORT: parseInt(argv.port) || 8080,
  MODE: argv.mode || 'FORK',
  EXP_TIME: parseInt(process.env.EXP_TIME) || (1000 * 60 * 10),
  PROCESS_INFO: info,
  NUMCPUS: numCPUs || 1,
  CANT_DEFAULT: parseInt(process.env.CANT_DEFAULT) || 1000000
}