import { Global, Module } from "@nestjs/common";
import { DataOnlyInterceptor } from "./interceptors/data-only.interceptor";
import { MessageOnlyInterceptor } from "./interceptors/message-only.interceptor";
import { DataMessageInterceptor } from "./interceptors/data-message.interceptor";

@Global()
@Module({
    providers: [
        DataOnlyInterceptor,
        MessageOnlyInterceptor,
        DataMessageInterceptor
    ],
    exports: [
        DataOnlyInterceptor,
        MessageOnlyInterceptor,
        DataMessageInterceptor
    ]
})
export class SharedModule {}