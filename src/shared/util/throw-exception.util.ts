import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

export function throwError(error: BadRequestException) {
    if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
    }

    throw new InternalServerErrorException("Something went wrong");
}