export const swaggerInternalResponse = {
    status: 500,
    content: {
        "application/json": {
            schema: {
                type: "object",
                example: {
                    message: "Something went wrong",
                    error: "Internal Server Error",
                    statusCode: 500
                }
            }
        }
    }
}