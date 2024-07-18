import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { CartPgService } from './services';
import { PgService } from 'src/storage/pg.service';
import { PgModule } from 'src/storage/pg.module';


@Module({
  imports: [ OrderModule, PgModule ],
  providers: [ CartService, CartPgService, PgService ],
  controllers: [ CartController ]
})
export class CartModule {}
