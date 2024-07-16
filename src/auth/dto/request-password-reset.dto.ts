import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestPasswordResetDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}