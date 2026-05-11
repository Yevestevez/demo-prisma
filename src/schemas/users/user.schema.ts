import { z } from 'zod';
import { ReviewModelSchema } from '../reviews/review.schema.ts';

export const ProfileModelSchema = z.object({
    firstName: z.string(),
    surname: z.string(),
    avatar: z.string(),
});

export const UserModelSchema = z.object({
    id: z.number(),
    email: z.string(),
    role: z.enum(['ADMIN', 'EDITOR', 'USER']),
    profile: ProfileModelSchema.optional(),
    reviews: z.array(ReviewModelSchema).optional(),
});

export const UserCredentialsModelSchema = UserModelSchema.pick({
    id: true,
    email: true,
    role: true,
});

export const UserCredentialsFullModelSchema = UserCredentialsModelSchema.extend(
    {
        password: z.string(),
    },
);

export const UserModelWithProfile = UserModelSchema.extend({
    profile: ProfileModelSchema,
});

export type Profile = z.infer<typeof ProfileModelSchema>;
export type UserCredentials = z.infer<typeof UserCredentialsModelSchema>;
export type FullUserCredentials = z.infer<
    typeof UserCredentialsFullModelSchema
>;
export type User = z.infer<typeof UserModelSchema>;
export type UserWithProfile = z.infer<typeof UserModelWithProfile>;
