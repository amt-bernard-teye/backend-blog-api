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