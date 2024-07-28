import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import { CartItem, CartStatuses, Product } from 'src/cart';

import { PgService } from 'src/storage/pg.service';


@Injectable()
export class OrderPgService {

    private orders: Record<string, Order> = {}

    constructor (private db: PgService) {}

    async findById(orderId: string): Promise< Order | undefined > {

        if (!orderId) {
          return
        }
    
        const query = 'SELECT o.id, o.user_id, o.cart_id, o.payment, o.delivery, o."comments", o.status, o.total \
          FROM cart.orders o\
          left outer join cart.cart_items i \
          on o.cart_id = i.cart_id \
          WHERE id = $1;';
        const values = [orderId];
        const rows = await this.db.executeQuery(query,values);
    
        if (rows.length > 0) {

            const cartItems: CartItem[] = [];

            for (let i = 0; i < rows.length; i++) {
                const product: Product = {
                  id: rows[0]?.product_id,
                  title: '',
                  description: '',
                  price: 0
                }
                const count = rows[0]?.count;
        
                if (product.id) {
                  cartItems.push({product, count})
                }
              }
        
      
          return {
            id: rows[0]?.id,
            userId: rows[0]?.user_id,
            cartId: rows[0]?.cart_id,
            items: cartItems,
            payment: rows[0]?.paymnet,
            delivery: rows[0]?.delivery,
            comments: rows[0]?.comments,
            status: rows[0]?.status,
            total: rows[0]?.total,
          }
        } else{
          return
        }
        
    }
    

    async create(data: any): Promise< Order | undefined > {
   
        const id = v4();
        const status = CartStatuses.OPEN;
    
        const values = [id, data.userId, data.cartId, data?.body?.payment, data?.body?.delivery, data?.body?.comments, status, data.total];
        const query = 'INSERT INTO cart.orders (id, user_id, cart_id, payment, delivery, "comments", status, total) \
            VALUES($1, $2, $3, $3, $4, $5, $6, $7, $8);';
    
        const rows = await this.db.executeQuery(query,values);
    
        return await this.findById(id);
    }
    

    async update(orderId, data): Promise <void> {
        const order = await this.findById(orderId);

        if (!order) {
            throw new Error('Order does not exist.');
        }

        const values = [orderId, data.userId, data.cartId, data?.payment, data?.delivery, data?.comments, data.total];
        const query = 'UPDATE cart.orders SET (user_id=$2, cart_id=$3, payment=$4, delivery=$5, \
            "comments"=$6, total=$7) \
            WHERE id=$1;';
    
        const rows = await this.db.executeQuery(query,values);

    }

    async checkout(data: any): Promise < void > {
   

        //return await this.findById(id);


        const client = await this.db.pool.connect()
 
        try {
          await client.query('BEGIN');

          const id = v4();
          const status = CartStatuses.ORDERED;
      
          let values = [id, data.userId, data.cartId, data?.payment, data?.delivery, data?.comments, status, data.total];
          let query = 'INSERT INTO cart.orders (id, user_id, cart_id, payment, delivery, "comments", status, total) \
              VALUES($1, $2, $3, $3, $4, $5, $6, $7, $8);';
      
          let rows = await this.db.executeQuery(query,values);
  
          query = 'DELETE FROM cart.cart_items i \
            USING cart.cart c \
            WHERE c.user_id=$1 and (i.cart_id = c."uuid");';
          values = [data.userId];
    
          rows = await this.db.executeQuery(query,values);
    
          query = 'DELETE FROM cart.cart \
            WHERE user_id=$1;';
          values = [data.userId];
    
          rows = await this.db.executeQuery(query,values);

          values = [id];
          query = 'SELECT id, user_id, cart_id, payment, delivery, "comments", status, total \
            FROM cart.orders \
            WHERE id=$1;';
      
          rows = await this.db.executeQuery(query,values);


          await client.query('COMMIT')
        } catch (e) {
          await client.query('ROLLBACK')
          throw e
        } finally {
          client.release()
        }
    
    
    }

}
