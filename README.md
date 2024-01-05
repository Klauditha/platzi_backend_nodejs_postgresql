# Platzi - Curso de Backend con Node.js: Base de Datos con PostgreSQL

## Contenedor docker

  - Levantar contenedor
  ```
  docker-compose up -d postgres
  ```

  - Ver contenedores corriendo
  ```
  docker-compose ps
  ```

  - Bajar contenedor
  ```
  docker-compose down
  ```

  - Abrir una terminal
  ```
  docker-compose exec postgres bash
  ```

  - Ver contenedores corriendo con ID
  ```
  docker ps
  ```

  - Inspeccionar contenedor
  ```
  docker inspect ID
  ```

## ORM

Un ORM es un modelo de programación que permite mapear las estructuras de una base de datos relacionales.

Al abstraer este tipo de programación, delegamos su implementación al backend, es decir, le añadimos una de responsabilidad a la capa transaccional del servidor: . ✨Los beneficios son los siguientes:

- Acciones como CRUD (Create, Read, Update, Delete) son administradas mediante ORM.
- La implementación de seeds o semillas, nos permiten recuperar, mediante código, la estructura de una BD.

Una de las bases teóricas para entender este modelo es mediante el conocimiento de DAO (Data Access Object) y DTO (Data Transfer Object), los cuales nos permiten desestructurar un ORM en módulos de abstracción para acceder a la DB y transferir datos desde la misma DB, respectivamente hablando. . 🙃Los contras sería:

- Delegación de responsabilidades al server
- Descentralización de trabajo, directa, de una BD.

## Sequelize

Instalación:
  ```
  npm install --save sequelize
  ```

Instalación drives para Postgres:
  ```
  npm install --save pg pg-hstore
  ```

- https://sequelize.org/ 

### Aclaraciones

- Podemos utilizar define o extend Model.
- Se infiere el nombre de la tabla y se generaliza en plural, sequelize.define('user', userSchema); definirá la tabla users.
- Existe el modo de sincronización global sequelize.sync() o particular modelo.sync()` donde tendremos parámetros:
  - force: true. Eliminar la existencia previa y creando en secuencia.
  - alter: true. Revisa si se cambiará alguna estructura, la nueva vs la previa.

Configuración de ORM

- Reutilizando las variables de entorno, las organizamos para determinar aquellas para database.
- config.js . Archivo de definición de variables de entorno

  ```
  /**
  * @description variables of database server
  */
  export const database = {
      dbName: process.env.PGDATABASE,
      dbHost: process.env.PGHOST || 'localhost',
      dbPort: process.env.PGPORT || '5432',
      dbUser: process.env.PGUSER,
      dbPassword: process.env.PGPASSWORD,
  };
  ```
- Definimos la librería de sequelize mediante la abstracción OOP.
- Sequelize.js . Archivo de definición de variables de entorno

  ```
  import { Sequelize as SequelizeClient } from 'sequelize';
  import { database } from '../config/config';
  import Error from '../utils/Error';

  const USER = encodeURIComponent(database.dbUser);
  const PASSWORD = encodeURIComponent(database.dbPassword);
  const URI = `postgres://${USER}:${PASSWORD}@${database.dbHost}:${database.dbPort}/${database.dbName}`;

  export default class Sequelize {
      /**
      * @private
      * @description singleton pattern for pool connection
      * @returns {object} - connection client
      */
      async #connect() {
          try {
              if (!Sequelize.connection) {
                  Sequelize.connection = new SequelizeClient(URI, {
                      logging: false,
                  });
                  await Sequelize.connection.authenticate();
              }
              return Sequelize.connection;
          } catch ({ message }) {
              throw new Error(message, 'DRIVER');
          }
      }
      /**
      * @description process definition for create database tables
      * @param {string} name - table name
      * @param {string} schema - table description
      * @returns {Promise} - response of library
      */
      async define(name, schema) {
          try {
              const db = await this.#connect();
              const model = await db.define(name, schema);
              return await model.sync();
          } catch (error) {
              if (!error) throw new Error(message, 'DEFINITION');
              throw error;
          }
      }
  }
  ```

- Creamos el schema :user.js

  ```
  import { DataTypes, Sequelize as SequelizeClient } from 'sequelize';

  /**
  * @description description of each field in the table
  * @typedef {Object} field definition
  * @property {boolean} allowNull - false=NOT NULL
  * @property {boolean} autoIncrement - each insert, increase the counter
  * @property {boolean} primaryKey - define is primary key
  * @property {boolean} type - expresion to match SQL type
  * @property {boolean} unique - difne as unique the field
  * @property {boolean} field - rename the field
  */
  export default {
      id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
      },
      email: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true,
      },
      password: {
          allowNull: false,
          type: DataTypes.STRING,
      },
      createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'created_at',
          defaultValue: SequelizeClient.DATE,
      },
      updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'updated_at',
          defaultValue: SequelizeClient.DATE,
      },
  };
  ```

- Creamos nuestro seed- seed.js . Archivo de creación de entorno limpio npm run seed

  ```
  import Sequelize from './../libs/sequelize';
  import userSchema from './models/user';
  import { complete, fail } from '../utils/Log';

  const sequelize = new Sequelize();
  const user = sequelize.define('user', userSchema);

  Promise.all([user])
      .then((responses) => complete('Creation process', responses))
      .catch(({ message }) => fail('Creation process', message));
  ```
