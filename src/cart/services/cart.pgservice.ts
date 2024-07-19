import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem, Product } from '../models';

import { CartStatuses } from '../models';

import { PgService } from 'src/storage/pg.service';

@Injectable()
export class CartPgService {

  constructor (private db: PgService) {}

  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise< Cart | undefined > {

    const query = 'SELECT c."uuid" , c.user_id, c.created_at, c.updated_at, c.status, i.product_id, i.count \
      FROM cart.cart c \
      left outer join cart.cart_items i \
      on c."uuid" = i.cart_id \
      WHERE user_id = $1;';
    const values = [userId];
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

        cartItems.push({product, count})
      }
  
      return {
        id: rows[0]?.uuid,
        user_id: rows[0]?.user_id,
        created_at: rows[0]?.created_at,
        updated_at: rows[0]?.updated_at,
        status: rows[0]?.status,
        items: cartItems,
      }
    } else{
      return
    }
    
  }

  async createByUserId(userId: string): Promise< Cart | undefined > {
   
    const id = v4();
    const date = new Date().toISOString();
    const status = CartStatuses.OPEN;

    const values = [id, userId, date, status];
    const query = 'INSERT INTO cart.cart ("uuid", user_id, created_at, updated_at, status) VALUES($1, $2, $3, $3, $4);';

    const rows = await this.db.executeQuery(query,values);

    if (rows.length > 0) {
      return await this.findByUserId(userId)
    } else{
      return
    }
  }

  async findOrCreateByUserId(userId: string): Promise< Cart >{
      
    console.log('userId: ', userId);
    if (!userId) {
        userId='c5aaafe7-bdfa-4fcb-8871-ec10b42135b3';
    }
      
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

/*
  updateByUserId(userId: string, { items }: Cart): Cart {
    const { id, ...rest } = this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }
*/
  async removeByUserId(userId): Promise <void> {

    const client = await this.db.pool.connect()
 
    try {
      await client.query('BEGIN');

      let query = 'DELETE FROM cart.cart_items i \
        USING cart.cart c \
        WHERE c.user_id=$1 and (i.cart_id = c."uuid");';
      let values = [userId];

      let rows = await this.db.executeQuery(query,values);

      query = 'DELETE FROM cart.cart \
        WHERE user_id=$1;';
      values = [userId];

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
