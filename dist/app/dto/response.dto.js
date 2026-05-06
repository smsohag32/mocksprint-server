"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDTO = void 0;
class ResponseDTO {
    static success(message, data, httpStatusCode = 200) {
        return {
            message,
            httpStatusCode,
            data,
        };
    }
    static error(message, httpStatusCode = 400) {
        return {
            message,
            httpStatusCode,
            data: null,
        };
    }
}
exports.ResponseDTO = ResponseDTO;
