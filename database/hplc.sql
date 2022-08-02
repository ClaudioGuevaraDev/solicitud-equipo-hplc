CREATE TABLE "roles" (
  "id" int PRIMARY KEY,
  "name" varchar(100) UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "email" varchar(100) UNIQUE NOT NULL,
  "password" varchar(100) NOT NULL,
  "url_image" varchar(255) UNIQUE,
  "verified" boolean DEFAULT false,
  "role_id" int
);

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");
