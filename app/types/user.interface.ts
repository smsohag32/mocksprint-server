export interface IUser {
   id: string;
   name: string;
   email: string;
   password: string;
   role: string;
   is_active: boolean;
   is_verified: boolean;
   email_verification_token: string | null;
   email_verification_expires: Date | null;
   last_login: Date | null;
   createdAt?: Date;
   updatedAt?: Date;
   comparePassword(candidatePassword: string): Promise<boolean>;
}
