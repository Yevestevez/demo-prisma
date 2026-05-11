import { z } from 'zod';

export const ProfileCreateDTOSchema = z.object({
    firstName: z.string(),
    surname: z.string(),
    avatar: z.string(),
});

export const ProfileUpdateDTOSchema = ProfileCreateDTOSchema.partial();

export const UserCredentialsDTOSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

export const UpdateUserDTOSchema = z.strictObject({
    email: z.string().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['ADMIN', 'EDITOR', 'USER']).optional(),
    // profile: ProfileCreateDTOSchema.partial().optional(),
});

export const RegisterUserDTOSchema = UserCredentialsDTOSchema.extend(
    z.object({
        role: z.enum(['ADMIN', 'EDITOR', 'USER']).optional(),
        profile: ProfileCreateDTOSchema,
    }).shape,
);

export type ProfileCreateDTO = z.infer<typeof ProfileCreateDTOSchema>;
export type ProfileUpdateDTO = z.infer<typeof ProfileUpdateDTOSchema>;
export type RegisterUserDTO = z.infer<typeof RegisterUserDTOSchema>;
export type LoginUserDTO = z.infer<typeof UserCredentialsDTOSchema>;
export type UserUpdateDTO = z.infer<typeof UpdateUserDTOSchema>;
