CREATE TABLE public.permissions (
    id serial4 NOT NULL PRIMARY KEY,
    "name" varchar(64) NOT NULL UNIQUE
);
CREATE TABLE public.roles (
    id serial4 NOT NULL PRIMARY KEY,
    "name" varchar(64) NOT NULL UNIQUE
);
CREATE TABLE public.users (
    id serial4 NOT NULL PRIMARY KEY,
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
    UNIQUE (email),
    UNIQUE (username),
    UNIQUE (oauth_id)
);
CREATE TABLE public.maps (
    id serial4 NOT NULL PRIMARY KEY,
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
    FOREIGN KEY (usr_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE TABLE public.roles_permissions (
    role_id int4 NOT NULL,
    permission_id int4 NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
);
CREATE TABLE public.users_roles (
    user_id int4 NOT NULL,
    role_id int4 NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE TABLE public.favourites (
    user_id int4 NOT NULL,
    map_id int4 NOT NULL,
    PRIMARY KEY (user_id, map_id),
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE TABLE public.floors (
    num int4 NOT NULL,
    map_id int4 NOT NULL,
    map_data jsonb NULL,
    PRIMARY KEY (map_id, num),
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE
);
CREATE TABLE public.room_types (
    id serial4 NOT NULL PRIMARY KEY,
    map_id int4 NULL,
    "name" varchar(64) NULL,
    UNIQUE (name, map_id),
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE
);
CREATE TABLE public.publish_form (
    id serial4 NOT NULL PRIMARY KEY,
    "name" varchar(64) NULL,
    last_name varchar(64) NULL,
    gmaps_url text NULL,
    map_type varchar(64) NULL,
    resolved bool DEFAULT false NULL,
    user_id int4 NULL,
    map_id int4 NULL,
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE TABLE public.reports (
    id serial4 NOT NULL PRIMARY KEY,
    user_id int4 NOT NULL,
    subject varchar(255) NOT NULL,
    "content" text NOT NULL,
    created_at timestamp NOT NULL,
    map_id int4 NULL,
    FOREIGN KEY (map_id) REFERENCES public.maps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
