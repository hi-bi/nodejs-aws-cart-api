    
CREATE TYPE cart.status_enum AS ENUM('OPEN', 'ORDERED');

CREATE TABLE cart.cart
(
    --uuid uuid DEFAULT gen_random_uuid(),
    uuid uuid NOT NULL,
	user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
	status cart.status_enum,
    CONSTRAINT cart_pkey_uuid PRIMARY KEY (uuid)
);

ALTER TABLE cart.cart
    OWNER TO cartowner;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.cart TO cartowner;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.cart TO cartuser;
REVOKE ALL ON TABLE cart.cart FROM PUBLIC;


CREATE TABLE cart.cart_items
(
    cart_id uuid NOT NULL,
    product_id uuid NOT NULL,
    count integer default 0,
    CONSTRAINT cart_pkey_cart_id_product_id PRIMARY KEY (cart_id, product_id)
);

ALTER TABLE cart.cart_items
    OWNER TO cartowner;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.cart_items TO cartowner;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE cart.cart_items TO cartuser;
REVOKE ALL ON TABLE cart.cart_items FROM PUBLIC;
     
    