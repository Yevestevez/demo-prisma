import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number(),
    email: z.string(),
    password: z.string(),
    profile: z.lazy(() => ProfileSchema).optional(),
    reviews: z.array(z.lazy(() => ReviewSchema)),
    created_at: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const ProfileSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string(),
    // user: relation to User
    created_at: z.date(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// export const FilmSchema = z.object({
//     id: z.number(),
//     title: z.string(),
//     year: z.date(),
//     director: z.string(),
//     duration: z.number(),
//     poster: z.string(),
//     rate: z.number(),
//     genres: z.array(z.lazy(() => GenreSchema)),
//     reviews: z.array(z.lazy(() => ReviewSchema)),
//     created_at: z.date(),
// });

// export type Film = z.infer<typeof FilmSchema>;

// export const GenreSchema = z.object({
//     id: z.number(),
//     name: z.string(),
//     film: z.array(z.lazy(() => FilmSchema)),
//     created_at: z.date(),
// });

// export type Genre = z.infer<typeof GenreSchema>;

export const ReviewSchema = z.object({
    userId: z.number(),
    filmId: z.number(),
    // user: relation to User
    // film: relation to Film
    review: z.string(),
    created: z.date(),
});

export type Review = z.infer<typeof ReviewSchema>;
