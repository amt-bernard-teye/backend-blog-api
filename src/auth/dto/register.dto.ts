import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword, Matches } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @Matches(/^[a-zA-Z ]*$/)
    @ApiProperty()
    name: string

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty()
    password: string

    @IsNotEmpty()
    @ApiProperty()
    confirmPassword: string
}