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
  "description" text NOT NULL,
  "creation_date" timestamp DEFAULT (now()),
  "score" int NOT NULL,
  "lider_id" int
);

CREATE TABLE "lideres" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar NOT NULL
);

CREATE TABLE "equipos" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "description" text NOT NULL,
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
  "folio" varchar UNIQUE,
  "name" varchar UNIQUE NOT NULL,
  "description" text NOT NULL,
  "start_date" timestamp,
  "termination_date" timestamp,
  "score" int NOT NULL
);

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "users" ADD FOREIGN KEY ("jerarquia_id") REFERENCES "jerarquias" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "grupos_lideres" (
  "grupos_lider_id" int NOT NULL,
  "lideres_id" int NOT NULL,
  PRIMARY KEY ("grupos_lider_id", "lideres_id")
);

ALTER TABLE "grupos_lideres" ADD FOREIGN KEY ("grupos_lider_id") REFERENCES "grupos" ("lider_id");

ALTER TABLE "grupos_lideres" ADD FOREIGN KEY ("lideres_id") REFERENCES "lideres" ("id");


ALTER TABLE "equipos" ADD FOREIGN KEY ("estado_id") REFERENCES "estados" ("id");

CREATE TABLE "users_grupos" (
  "users_id" int NOT NULL,
  "grupos_id" int NOT NULL,
  PRIMARY KEY ("users_id", "grupos_id")
);

ALTER TABLE "users_grupos" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "users_grupos" ADD FOREIGN KEY ("grupos_id") REFERENCES "grupos" ("id");


CREATE TABLE "grupos_proyectos" (
  "grupos_id" int NOT NULL,
  "proyectos_id" int NOT NULL,
  PRIMARY KEY ("grupos_id", "proyectos_id")
);

ALTER TABLE "grupos_proyectos" ADD FOREIGN KEY ("grupos_id") REFERENCES "grupos" ("id");

ALTER TABLE "grupos_proyectos" ADD FOREIGN KEY ("proyectos_id") REFERENCES "proyectos" ("id");


CREATE TABLE "users_proyectos" (
  "users_id" int NOT NULL,
  "proyectos_id" int NOT NULL,
  PRIMARY KEY ("users_id", "proyectos_id")
);

ALTER TABLE "users_proyectos" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");

ALTER TABLE "users_proyectos" ADD FOREIGN KEY ("proyectos_id") REFERENCES "proyectos" ("id");

