import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { BasicStrategy  } from './strategies';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register(
      {defaultStrategy: 'basic'}
    ), //.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    AuthService,
    BasicStrategy,
  ],
  exports: [ AuthService ],
})
export class AuthModule {}
