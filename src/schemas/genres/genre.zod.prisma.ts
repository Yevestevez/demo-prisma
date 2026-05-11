/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
    FilmModel,
    ReviewModel,
} from '../../../generated/prisma/models.ts';
import type {
    GenreCreateInput,
    GenreModel,
} from '../../../generated/prisma/models.ts';
import type { Assert, IsExact } from '../../types/tools.ts';
import type { GenreCreateDTO, GenreUpdateDTO } from './genre.dto.ts';
import type { Genre, GenreDetail } from '../genres/genre.schema.ts';

type FilmModelShape = FilmModel & {
    genres?: Omit<GenreModel, 'id'>[];
    reviews?: ReviewModel[];
};
type GenreDetailModelShape = GenreModel & {
    films: Omit<FilmModelShape, 'reviews'>[];
};
type _GenreCheck = Assert<IsExact<Genre, GenreModel>>;
type _GenreDetailCheck = Assert<IsExact<GenreDetail, GenreDetailModelShape>>;
type GenreCreateShape = Pick<GenreCreateInput, 'name'>;
type _GenreCreateDTOCheck = Assert<IsExact<GenreCreateDTO, GenreCreateShape>>;
type _GenreUpdateDTOCheck = Assert<IsExact<GenreUpdateDTO, GenreCreateShape>>;
