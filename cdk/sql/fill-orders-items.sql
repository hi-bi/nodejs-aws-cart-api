insert into cart.orders
(id, user_id, cart_id, payment, delivery, "comments", status, total)
values ('77777777-7560-4d48-9362-f168aedf6e96', 'c5aaafe7-bdfa-4fcb-8871-ec10b42135b3', '2e2fb68b-7560-4d48-9362-f168aedf6e96',
	'{
		"payment": "online"
	}',
	'{
		"address": "test address"
	}',
	'test comment', 'ORDERED', 0
	);