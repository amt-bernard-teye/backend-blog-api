import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

import { UserRepository } from 'src/database/repository/user.repository';

@Injectable()
export class AuthService {
    constructor (
        private userRepo: UserRepository,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {}

    async seedAdmin() {
        const adminName = this.configService.get("ADMIN_NAME");
        const adminEmail = this.configService.get("ADMIN_EMAIL");
        const adminPassword = this.configService.get("ADMIN_PASSWORD");

        try {
            const existingAdmin = await this.userRepo.find(adminEmail);

            if (existingAdmin) {
                return "Admin already exist";
            }

            await this.userRepo.add({
                name: adminName,
                email: adminEmail,
                role: Role.ADMIN,
                password: adminPassword
            });

            return "Admin added successfully"; 
        }
        catch(error) {
            throw new InternalServerErrorException("Something went wrong");
        }
    }
}
