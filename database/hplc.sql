CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "url_image" varchar UNIQUE,
  "verified" boolean DEFAULT false,
  "change_password" boolean DEFAULT false,
  "jerarquia_id" int,
  "role_id" int
);

CREATE TABLE "jerarquias" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "score" int NOT NULL
);

CREATE TABLE "grupos" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "creation_date" timestamp NOT NULL,
  "score" int NOT NULL,
  "lider" varchar NOT NULL
);

CREATE TABLE "equipos" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "url_image" varchar UNIQUE,
  "date_obtained" timestamp,
  "estado_id" int
);

CREATE TABLE "estados" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "proyectos" (
  "id" SERIAL PRIMARY KEY,
  "folio" varchar,
  "name" varchar UNIQUE NOT NULL,
  "start_date" timestamp,
  "termination_date" timestamp,
  "score" int NOT NULL,
  "grupo_id" int
);

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "users" ADD FOREIGN KEY ("jerarquia_id") REFERENCES "jerarquias" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "equipos" ADD FOREIGN KEY ("estado_id") REFERENCES "estados" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "proyectos" ADD FOREIGN KEY ("grupo_id") REFERENCES "grupos" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "users_grupos" (
  "users_id" int NOT NULL,
  "grupos_id" int NOT NULL,
  PRIMARY KEY ("users_id", "grupos_id")
);

ALTER TABLE "users_grupos" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "users_grupos" ADD FOREIGN KEY ("grupos_id") REFERENCES "grupos" ("id");


CREATE TABLE "users_proyectos" (
  "users_id" int NOT NULL,
  "proyectos_id" int NOT NULL,
  PRIMARY KEY ("users_id", "proyectos_id")
);

ALTER TABLE "users_proyectos" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "users_proyectos" ADD FOREIGN KEY ("proyectos_id") REFERENCES "proyectos" ("id");

