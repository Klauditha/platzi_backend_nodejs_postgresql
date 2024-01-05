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

