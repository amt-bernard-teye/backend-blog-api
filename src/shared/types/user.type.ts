import { AccountVerification, Role } from "@prisma/client";

export type User = {
    id?: string;
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: Role;
    accountVerification?: AccountVerification
}

export type UserProp = {
    id: boolean;
    name: boolean;
    email: boolean;
    image: boolean;
    role: boolean;
    accountVerification: boolean;
}