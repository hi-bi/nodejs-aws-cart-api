import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { OrderPgService } from './services';
import { PgService } from 'src/storage/pg.service';
import { PgModule } from 'src/storage/pg.module';

@Module({
  imports: [PgModule],
  providers: [ OrderService, OrderPgService, PgService ],
  exports: [ OrderService ]
})
export class OrderModule {}
