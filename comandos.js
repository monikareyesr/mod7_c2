const { Pool } = require('pg')

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'always_music2',
  password: 'admin',
  min: 3,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
  port: 5432
}
const pool = new Pool(config)

//funcion asincronica crear Alumno
async function crearAlumno(nombre, rut, curso, nivel) {
  const client = await pool.connect()
  // 2. Ejecuto la consulta SQL
  const resp = await client.query(`insert into alumnos (nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', ${nivel}) returning *`)

  console.log(resp.rows);

  // 3. Devuelvo el cliente al pool
  client.release()
  pool.end()
}

//funcion asincronica consultar todos los alumnos
async function consultar_alumnos() {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  client.connect(async error => {
    if (error) {
      console.log(error)
    }
    const resp = await client.query('select * from alumnos')
    console.log(resp.rows);

    client.release()
    pool.end()  //libero al cliente
  });

}
//funcion asincronica consultar por rut
async function consultarRut(id_rut) {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  let rut = await client.query(`select * from alumnos where  rut ='${id_rut}'`)
  rut = rut.rows[0]

  console.log(`el rut solicitado corresponde a ${rut.nombre}`);

  // 3. Devuelvo el cliente al pool
  client.release()
  pool.end()
}

//acciones
const accion = process.argv[2] //la posicion de la accion no cambia, cambia el nombre de ella.
//accion para consultar
if (accion == "consultar") {
  consultar_alumnos()
}
//accion consultar por rut
else if (accion == "consultarRut") {
  const id_rut = process.argv[3]
  consultarRut(id_rut)
}

else if (accion == "nuevo") {
  //creamos un nuevo alumno
  const nombre = process.argv[3]
  const rut = process.argv[4]
  const curso = process.argv[5]
  const nivel = process.argv[6]

  crearAlumno(nombre, rut, curso, nivel)
}


else {
  console.log(`Acción ${accion} no implementada`);
}

