CREATE TABLE cart.orders
(
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    cart_id uuid NOT NULL,
    payment json,
    delivery json,
    comments text,
  	status cart.status_enum,
	total numeric(18,2),
    CONSTRAINT orders_pkey_id PRIMARY KEY (id)
);

ALTER TABLE cart.orders
    OWNER TO cartowner;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.orders TO cartowner;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.orders TO cartuser;
REVOKE ALL ON TABLE cart.orders FROM PUBLIC;