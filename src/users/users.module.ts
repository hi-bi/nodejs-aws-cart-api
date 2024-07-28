import { Module } from '@nestjs/common';

import { UsersPgService } from './services';
import { PgModule } from 'src/storage/pg.module';

@Module({
  imports: [ PgModule ],
  providers: [ UsersPgService ],
  exports: [ UsersPgService ],
})
export class UsersModule {}
