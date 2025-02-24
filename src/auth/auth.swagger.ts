export const swaggerLoginSuccessResponse = {
    description: "OK",
    status: 200,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBRDEiLCJ0b2tlbiI6ImFjYy10ay1lcyIsImlhdCI6MTcyMTEyNTUxNiwiZXhwIjoxNzIxMTI2NDE2fQ.dKfTtvh34cNYpwjsaU4yBJ1cH7cdvqJC4dDfKcgV45A",
                    user: {
                        "id": "AD1",
                        "name": "ADMIN_NAME",
                        "email": "admin@mail.com",
                        "image": null,
                        "accountVerification": "PENDING",
                        "role": "ADMIN"
                    }
                }
            }
        }
    }
}

export const swaggerLoginValidationResponse = {
    description: "Validation Error",
    status: 400,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: [
                        "email must be an email",
                        "email should not be empty",
                        "password should not be empty"
                    ],
                    error: "Bad Request",
                    statusCode: 400
                }
            }
        }
    }
}

export const swaggerRegisterSuccessResponse = {
    description: "OK",
    status: 200,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Please check your email to complete the registration process",
                }
            }
        }
    }
}

export const swaggerRegisterValidationResponse = {
    description: "Validation Error",
    status: 400,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: [
                      "name should not be empty",
                      "email must be an email",
                      "email should not be empty",
                      "password is not strong enough",
                      "password should not be empty",
                      "confirmPassword should not be empty"
                    ],
                    error: "Bad Request",
                    statusCode: 400
                }
            }
        }
    }
}

export const swaggerEmailConfirmationSuccessResponse = {
    description: "OK",
    status: 200,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Email address successfully verified",
                }
            }
        }
    }
}

export const swaggerEmailConfirmationValidationResponse = {
    description: "Validation failed",
    status: 400,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Invalid token",
                    error: "Bad Request",
                    statusCode: 400
                }
            }
        }
    }
}

export const swaggerRequestPasswordResetSuccessResponse = {
    description: "OK",
    status: 200,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Please check your email to complete your reset process"
                }
            }
        }
    }
}

export const swaggerRequestPasswordResetValidationResponse = {
    description: "Validation failed",
    status: 400,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Email not recognized, please check your email and try again",
                    error: "Bad Request",
                    statusCode: 400
                }
            }
        }
    }
}

export const swaggerResetPasswordSuccessResponse = {
    description: "OK",
    status: 200,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Successfully reset your password"
                }
            }
        }
    }
}

export const swaggerResetPasswordValidationResponse = {
    description: "Validation failed",
    status: 400,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Passwords do not match each other",
                    error: "Bad Request",
                    statusCode: 400
                }
            }
        }
    }
}

export const swaggerRefreshTokenSuccessResponse = {
    description: "OK",
    status: 200,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJBRDEiLCJ0b2tlbiI6ImFjYy10ay1lcyIsImlhdCI6MTcyMTEzNDg1NSwiZXhwIjoxNzIxMTM1NzU1fQ.qa_Cgf6gR50EBAco4gbR_EqOdAt6tRIwrjQPtjEnats"
                }
            }
        }
    }
}

export const swaggerRefreshTokenValidationResponse = {
    description: "Validation failed",
    status: 401,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Access denied",
                    error: "Unauthorized Request",
                    statusCode: 401
                }
            }
        }
    }
}