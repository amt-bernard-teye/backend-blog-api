import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    JwtModule.register({global: true}),
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    SharedModule,
    AuthModule,
    MailerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
