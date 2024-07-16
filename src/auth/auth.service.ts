import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcryptjs from "bcryptjs";

import { UserRepository } from 'src/database/repository/user.repository';
import { User } from 'src/shared/types/user.type';
import { throwError } from 'src/shared/util/throw-exception.util';
import { AuthToken } from './auth-token';

@Injectable()
export class AuthService {
    private secretKey = "";

    constructor (
        private userRepo: UserRepository,
        private configService: ConfigService,
        private jwtService: JwtService
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
}
