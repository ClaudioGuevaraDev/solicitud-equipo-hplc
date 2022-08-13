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
  "role_id" int,
  "priority" float DEFAULT 100
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
  "estado_equipo_id" int
);

CREATE TABLE "estado_equipos" (
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

CREATE TABLE "solicitudes" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "grupo_id" int,
  "proyecto_id" int,
  "equipo_id" int,
  "created_at" timestamp DEFAULT (now()),
  "assigned_date" timestamp,
  "canceled" boolean DEFAULT false,
  "estado_solicitud_id" int
);

CREATE TABLE "estado_solicitudes" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "users" ADD FOREIGN KEY ("jerarquia_id") REFERENCES "jerarquias" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "equipos" ADD FOREIGN KEY ("estado_equipo_id") REFERENCES "estado_equipos" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "proyectos" ADD FOREIGN KEY ("grupo_id") REFERENCES "grupos" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "users_grupos" (
  "users_id" int NOT NULL,
  "grupos_id" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT (now()),
  PRIMARY KEY ("users_id", "grupos_id")
);

ALTER TABLE "users_grupos" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE; 

ALTER TABLE "users_grupos" ADD FOREIGN KEY ("grupos_id") REFERENCES "grupos" ("id") ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE "users_proyectos" (
  "users_id" int NOT NULL,
  "proyectos_id" int NOT NULL,
  "created_at" TIMESTAMP DEFAULT (now()),
  PRIMARY KEY ("users_id", "proyectos_id")
);

ALTER TABLE "users_proyectos" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "users_proyectos" ADD FOREIGN KEY ("proyectos_id") REFERENCES "proyectos" ("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE "solicitudes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("grupo_id") REFERENCES "grupos" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("proyecto_id") REFERENCES "proyectos" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("equipo_id") REFERENCES "equipos" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("estado_solicitud_id") REFERENCES "estado_solicitudes" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
