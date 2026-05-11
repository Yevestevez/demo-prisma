import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/client';
import { GenreModelSchema } from '../genres/genre.schema.ts';
import { ReviewModelSchema } from '../reviews/review.schema.ts';

export const FilmModelSchema = z.object({
    id: z.number(),
    title: z.string(),
    year: z.number(),
    director: z.string(),
    duration: z.number(),
    poster: z.string().nullable(),
    rate: z.instanceof(Decimal),
    genres: z.array(GenreModelSchema.omit({ id: true })).optional(),
    get reviews() {
        return z.array(ReviewModelSchema.omit({ film: true })).optional();
    },
});

export type Film = z.infer<typeof FilmModelSchema>;
