import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Get("seed-admin") 
    seedAdmin() {
        return this.authService.seedAdmin();
    }


}
