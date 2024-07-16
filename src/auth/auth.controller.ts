import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

import { swaggerEmailConfirmationSuccessResponse, swaggerEmailConfirmationValidationResponse, swaggerLoginSuccessResponse, swaggerLoginValidationResponse, swaggerRefreshTokenSuccessResponse, swaggerRefreshTokenValidationResponse, swaggerRegisterSuccessResponse, swaggerRegisterValidationResponse, swaggerRequestPasswordResetSuccessResponse, swaggerRequestPasswordResetValidationResponse, swaggerResetPasswordSuccessResponse, swaggerResetPasswordValidationResponse } from './auth.swagger';
import { swaggerInternalResponse } from 'src/shared/internal.swagger';
import { AuthToken } from './auth-token';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import { DataMessageInterceptor } from 'src/shared/interceptors/data-message.interceptor';
import { RegisterDto } from './dto/register.dto';
import { MessageOnlyInterceptor } from 'src/shared/interceptors/message-only.interceptor';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DataOnlyInterceptor } from 'src/shared/interceptors/data-only.interceptor';

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

    @Get("email-confirmation")
    @UseInterceptors(MessageOnlyInterceptor)
    @ApiResponse(swaggerInternalResponse)
    @ApiResponse(swaggerEmailConfirmationSuccessResponse)
    @ApiResponse(swaggerEmailConfirmationValidationResponse)
    emailConfirmation(@Query("token") token: string) {
        if (!token) {
            throw new BadRequestException("Please provide a token");
        }

        return this.authService.emailConfirmation(token);
    }

    @Post("forgot-password")
    @UseInterceptors(MessageOnlyInterceptor)
    @ApiResponse(swaggerInternalResponse)
    @ApiResponse(swaggerRequestPasswordResetSuccessResponse)
    @ApiResponse(swaggerRequestPasswordResetValidationResponse)
    requestPasswordReset(@Body(ValidationPipe) body: RequestPasswordResetDto) {
        return this.authService.requestPasswordReset(body.email);
    }

    @Post("reset-password")
    @UseInterceptors(MessageOnlyInterceptor)
    @ApiResponse(swaggerInternalResponse)
    @ApiResponse(swaggerResetPasswordValidationResponse)
    @ApiResponse(swaggerResetPasswordSuccessResponse)
    resetPassword(@Body(ValidationPipe) body: ResetPasswordDto, @Query("token") token: string) {
        if (body.password !== body.confirmPassword) {
            throw new BadRequestException("Passwords do not match each other");
        }

        return this.authService.resetPassword(token, body.password);
    }

    @Get("refresh-token")
    @ApiResponse(swaggerInternalResponse)
    @ApiResponse(swaggerRefreshTokenSuccessResponse)
    @ApiResponse(swaggerRefreshTokenValidationResponse)
    refreshAccessToken(@Req() req: Request) {
        const refreshToken = req.cookies[AuthToken.REFRESH_TOKEN];
        return this.authService.refreshAccessToken(refreshToken);
    }
}
