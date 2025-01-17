-- public.favourites definition

-- Drop table

-- DROP TABLE public.favourites;

CREATE TABLE public.favourites (
	user_id int4 NOT NULL,
	map_id int4 NOT NULL,
	CONSTRAINT favourites_pkey PRIMARY KEY (user_id, map_id)
);


-- public.favourites foreign keys

ALTER TABLE public.favourites ADD CONSTRAINT favourites_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE public.favourites ADD CONSTRAINT favourites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- public.floors definition

-- Drop table

-- DROP TABLE public.floors;

CREATE TABLE public.floors (
	num int4 NOT NULL,
	map_id int4 NOT NULL,
	map_data jsonb NULL,
	CONSTRAINT floors_pkey PRIMARY KEY (map_id, num)
);


-- public.floors foreign keys

ALTER TABLE public.floors ADD CONSTRAINT floors_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;

-- public.maps definition

-- Drop table

-- DROP TABLE public.maps;

CREATE TABLE public.maps (
	id serial4 NOT NULL,
	"name" varchar(64) NULL,
	gmaps_url text NULL,
	published_at timestamp NULL,
	created_at timestamp NULL,
	modified_at timestamp NULL,
	image_url text NULL,
	usr_id int4 NULL,
	status varchar(16) NULL,
	map_type varchar(64) NULL,
	is_published bool DEFAULT false NULL,
	CONSTRAINT maps_pkey PRIMARY KEY (id)
);


-- public.maps foreign keys

ALTER TABLE public.maps ADD CONSTRAINT maps_usr_id_fkey FOREIGN KEY (usr_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- public.permissions definition

-- Drop table

-- DROP TABLE public.permissions;

CREATE TABLE public.permissions (
	id serial4 NOT NULL,
	"name" varchar(64) NOT NULL,
	CONSTRAINT permissions_name_key UNIQUE (name),
	CONSTRAINT permissions_pkey PRIMARY KEY (id)
);

-- public.publish_form definition

-- Drop table

-- DROP TABLE public.publish_form;

CREATE TABLE public.publish_form (
	id serial4 NOT NULL,
	"name" varchar(64) NULL,
	last_name varchar(64) NULL,
	gmaps_url text NULL,
	map_type varchar(64) NULL,
	resolved bool DEFAULT false NULL,
	user_id int4 NULL,
	map_id int4 NULL,
	CONSTRAINT publish_form_pkey PRIMARY KEY (id)
);


-- public.publish_form foreign keys

ALTER TABLE public.publish_form ADD CONSTRAINT publish_form_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE public.publish_form ADD CONSTRAINT publish_form_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- public.reports definition

-- Drop table

-- DROP TABLE public.reports;

CREATE TABLE public.reports (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	subject varchar(255) NOT NULL,
	"content" text NOT NULL,
	created_at timestamp NOT NULL,
	map_id int4 NULL,
	CONSTRAINT reports_pkey PRIMARY KEY (id)
);


-- public.reports foreign keys

ALTER TABLE public.reports ADD CONSTRAINT reports_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;
ALTER TABLE public.reports ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- public.roles definition

-- Drop table

-- DROP TABLE public.roles;

CREATE TABLE public.roles (
	id serial4 NOT NULL,
	"name" varchar(64) NOT NULL,
	CONSTRAINT roles_name_key UNIQUE (name),
	CONSTRAINT roles_pkey PRIMARY KEY (id)
);

-- public.roles_permissions definition

-- Drop table

-- DROP TABLE public.roles_permissions;

CREATE TABLE public.roles_permissions (
	role_id int4 NOT NULL,
	permission_id int4 NOT NULL,
	CONSTRAINT roles_permissions_pkey PRIMARY KEY (role_id, permission_id)
);


-- public.roles_permissions foreign keys

ALTER TABLE public.roles_permissions ADD CONSTRAINT roles_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
ALTER TABLE public.roles_permissions ADD CONSTRAINT roles_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;

-- public.room_types definition

-- Drop table

-- DROP TABLE public.room_types;

CREATE TABLE public.room_types (
	id serial4 NOT NULL,
	map_id int4 NULL,
	"name" varchar(64) NULL,
	CONSTRAINT room_types_name_map_id_key UNIQUE (name, map_id),
	CONSTRAINT room_types_pkey PRIMARY KEY (id)
);


-- public.room_types foreign keys

ALTER TABLE public.room_types ADD CONSTRAINT room_types_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE;

-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id serial4 NOT NULL,
	username varchar(64) NULL,
	"password" text NULL,
	email varchar(128) NULL,
	created_at timestamp NULL,
	last_login_at timestamp NULL,
	profile_image_url text NULL,
	oauth_provider varchar(64) NULL,
	refresh_token text NULL,
	access_token text NULL,
	oauth_id varchar(255) NULL,
	CONSTRAINT unique_email UNIQUE (email),
	CONSTRAINT unique_username UNIQUE (username),
	CONSTRAINT users_oauth_id_key UNIQUE (oauth_id),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- public.users_roles definition

-- Drop table

-- DROP TABLE public.users_roles;

CREATE TABLE public.users_roles (
	user_id int4 NOT NULL,
	role_id int4 NOT NULL,
	CONSTRAINT users_roles_pkey PRIMARY KEY (user_id, role_id)
);


-- public.users_roles foreign keys

ALTER TABLE public.users_roles ADD CONSTRAINT users_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
ALTER TABLE public.users_roles ADD CONSTRAINT users_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

