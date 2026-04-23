export interface AuthResponse {
   token: string;
   refresh_token: string;
   user: {
      id: string;
      name: string;
      email: string;
      role: string;
      is_active: boolean;
      is_verified: boolean;
      phone: string | null;
      profile_image: string | null;
   };
}

export interface SignUpResponse {
   message: string;
   user: {
      id: string;
      name: string;
      email: string;
      is_active: boolean;
      is_verified: boolean;
   };
}
