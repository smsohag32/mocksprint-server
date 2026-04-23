import mongoose from "mongoose";

export interface IProfile extends mongoose.Document {
   id: string;
   first_name?: string;
   last_name?: string;
   user_id: mongoose.Schema.Types.ObjectId;
   blood_group?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
   profile_image?: string;
   phone?: string;
   secondary_phone?: string;
   address?: string;
   last_donation_date?: Date;
   available_donate?: boolean;
   createdAt?: Date;
   updatedAt?: Date;
}
