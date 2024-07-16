import { BadRequestException, Body, Controller, Get, Post, Res, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

import { swaggerLoginSuccessResponse, swaggerLoginValidationResponse, swaggerRegisterSuccessResponse, swaggerRegisterValidationResponse } from './auth.swagger';
import { swaggerInternalResponse } from 'src/shared/internal.swagger';
import { AuthToken } from './auth-token';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import { DataMessageInterceptor } from 'src/shared/interceptors/data-message.interceptor';
import { RegisterDto } from './dto/register.dto';
import { MessageOnlyInterceptor } from 'src/shared/interceptors/message-only.interceptor';
import { IsEmail } from 'class-validator';

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

    @Post("register")
    @ApiResponse(swaggerInternalResponse)
    @ApiResponse(swaggerRegisterSuccessResponse)
    @ApiResponse(swaggerRegisterValidationResponse)
    @UseInterceptors(MessageOnlyInterceptor)
    register(@Body(ValidationPipe) body: RegisterDto) {
        if (body.password !== body.confirmPassword) {
            throw new BadRequestException("Passwords do not match each other");
        }

        return this.authService.register(body.name, body.email, body.password);
    }
}
