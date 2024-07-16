import { Body, Controller, Get, Post, Res, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

import { swaggerLoginSuccessResponse, swaggerLoginValidationResponse } from './auth.swagger';
import { swaggerInternalResponse } from 'src/shared/internal.swagger';
import { AuthToken } from './auth-token';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import { DataMessageInterceptor } from 'src/shared/interceptors/data-message.interceptor';

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

    @Post("login")
    @ApiResponse(swaggerInternalResponse)
    @ApiResponse(swaggerLoginSuccessResponse)
    @ApiResponse(swaggerLoginValidationResponse)
    @ResponseMessage("You are logged in")
    @UseInterceptors(DataMessageInterceptor)
    async login(@Body(ValidationPipe) body: LoginDto, @Res({passthrough: true}) res: Response) {
        const result = await this.authService.login(body.email, body.password);
        const accessToken = result.authTokens.accessToken;

        const seconds = 60, hours = 24, days = 30, milliseconds = 1000;
        const refreshDuration = seconds * seconds * hours * days * milliseconds;
        res.cookie(AuthToken.REFRESH_TOKEN, result.authTokens.refreshToken, {maxAge: refreshDuration, httpOnly: true});

        return {
            token: accessToken,
            user: result.user
        };
    }
}
