export class ResponseDTO {
   static success(message: string, data: any, httpStatusCode: number = 200) {
      return {
         message,
         httpStatusCode,
         data,
      };
   }

   static error(message: string, httpStatusCode: number = 400) {
      return {
         message,
         httpStatusCode,
         data: null,
      };
   }
}
