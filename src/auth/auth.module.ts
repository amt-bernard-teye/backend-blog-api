import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MailerModule]
})
export class AuthModule {}
