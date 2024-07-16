import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountVerification, Role } from '@prisma/client';
import * as bcryptjs from "bcryptjs";

import { UserRepository } from 'src/database/repository/user.repository';
import { User } from 'src/shared/types/user.type';
import { throwError } from 'src/shared/util/throw-exception.util';
import { AuthToken } from './auth-token';
import { RegisterAccountService } from 'src/mailer/service/register-account.service';
import { ForgotPasswordService } from 'src/mailer/service/forgot-password.service';

@Injectable()
export class AuthService {
    private secretKey = "";

    constructor (
        private userRepo: UserRepository,
        private configService: ConfigService,
        private jwtService: JwtService,
        private registerService: RegisterAccountService,
        private forgotPasswordService: ForgotPasswordService
    ) {
        this.secretKey = this.configService.get("SECRET_KEY");
    }

    async seedAdmin() {
        const adminName = this.configService.get("ADMIN_NAME");
        const adminEmail = this.configService.get("ADMIN_EMAIL");
        const adminPassword = this.configService.get("ADMIN_PASSWORD");
        const hashedPassword = await bcryptjs.hash(adminPassword, 10);

        try {
            const existingAdmin = await this.userRepo.find(adminEmail);

            if (existingAdmin) {
                return "Admin already exist";
            }

            await this.userRepo.add({
                name: adminName,
                email: adminEmail,
                role: Role.ADMIN,
                password: hashedPassword
            });

            return "Admin added successfully"; 
        }
        catch(error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }

    async login(email: string, pass: string) {
        try {
            const existingUser = await this.userRepo.find(email);
            const hashedPassword = existingUser ? existingUser.password : "";
            const samePassword = await bcryptjs.compare(pass, hashedPassword);

            if (!existingUser || !samePassword) {
                throw new InternalServerErrorException();
            }

            let authTokens = this.generateAccessAndRefreshToken(existingUser);
            let {password, ...user} = existingUser;

            return {user, authTokens};
        }
        catch(error) {
            throwError(error);
        }
    }

    private generateAccessAndRefreshToken(user: User) {
        const accessTokenDuration = "15m";
        const accessToken = this.jwtService.sign({
            sub: user.id,
            token: AuthToken.ACCESS_TOKEN
        }, {secret: this.secretKey, expiresIn: accessTokenDuration});

        const refreshTokenDuration = "30d";
        const refreshToken = this.jwtService.sign({
            sub: user.id,
            token: AuthToken.REFRESH_TOKEN
        }, {secret: this.secretKey, expiresIn: refreshTokenDuration});

        return {
            accessToken, 
            refreshToken
        };
    }

    async register(name: string, email: string, password: string) {
        try {
            const existingUser = await this.userRepo.find(email);

            if (existingUser) {
                throw new BadRequestException("Email already exist");
            }

            const hashedPassword = await bcryptjs.hash(password, 10);
            const user = await this.userRepo.add({
                name: name,
                email,
                password: hashedPassword,
                role: Role.READER,
            });

            const token = this.jwtService.sign({sub: user.id}, {secret: this.secretKey});
            await this.registerService.sendMail({ email, name, token });

            return "Please check your email to complete the registration process";
        }
        catch(error) {
            throwError(error);
        }
    }

    async emailConfirmation(token: string) {
        try {
            const result = await this.jwtService.verify(token, {secret: this.secretKey});
            
            const existingUser = await this.userRepo.find(result.sub);

            if (!existingUser) {
                throw new Error();
            }

            existingUser.accountVerification = AccountVerification.VERIFIED;
            await this.userRepo.update(existingUser);

            return "Email address successfully verified";
        }
        catch(error) {
            throw new BadRequestException("Invalid token");
        }
    }

    async requestPasswordReset(email: string) {
        try {
            const existingUser = await this.userRepo.find(email);

            if (!existingUser) {
                throw new BadRequestException("Email not recognized, please check your email and try again");
            }

            const token = this.jwtService.sign({sub: existingUser.id}, {secret: this.secretKey});
            await this.forgotPasswordService.sendMail({
                name: existingUser.name,
                email,
                token
            });

            return "Please check your email to complete your reset process";
        }
        catch(error) {
            throwError(error);
        }
    }

    async resetPassword(token: string, pass: string) {
        try {
            const result = await this.jwtService.verify(token, {secret: this.secretKey});
            const existingUser = await this.userRepo.find(result.sub);

            if (!existingUser) {
                throw new BadRequestException("Invalid token");
            }

            const hashedPassword = await bcryptjs.hash(pass, 10);
            existingUser.password = hashedPassword;
            await this.userRepo.update(existingUser);

            return "Successfully reset your password";
        }
        catch(error) {
            throwError(error);
        }
    }
}
