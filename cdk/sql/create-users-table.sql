CREATE TABLE cart.users
(
    id uuid NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    email text NULL,
    CONSTRAINT users_pkey_id PRIMARY KEY (id)
);

ALTER TABLE cart.users
    OWNER TO cartowner;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.users TO cartowner;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.users TO cartuser;
REVOKE ALL ON TABLE cart.users FROM PUBLIC;