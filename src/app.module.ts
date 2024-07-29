import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

import { PgModule } from './storage/pg.module';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    PgModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
