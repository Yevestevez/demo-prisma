/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Review } from '../../../generated/prisma/client.ts';
import type {
    ReviewModel,
    ReviewUncheckedCreateInput,
    ReviewUserIDFilmIDCompoundUniqueInput,
} from '../../../generated/prisma/models.ts';
import type { Assert, IsExact } from '../../types/tools.ts';
import type {
    ReviewCreateBodyDTO,
    ReviewCreateDTO,
    ReviewFilmParamsDTO,
    ReviewParamsDTO,
    ReviewUpdateDTO,
    ReviewUserParamsDTO,
} from './review.dto.ts';

type ReviewCreateShape = Pick<
    ReviewUncheckedCreateInput,
    'review' | 'userID' | 'filmID'
> & {
    rate: number;
};

type ReviewUpdateShape = Partial<Pick<ReviewCreateShape, 'review' | 'rate'>>;
type ReviewParamsShape = ReviewUserIDFilmIDCompoundUniqueInput;
type _ReviewCheck = Assert<IsExact<Review, ReviewModel>>;
type _ReviewCreateBodyDTOCheck = Assert<
    IsExact<ReviewCreateBodyDTO, Omit<ReviewCreateShape, 'userID' | 'filmID'>>
>;
type _ReviewCreateDTOCheck = Assert<
    IsExact<ReviewCreateDTO, ReviewCreateShape>
>;
type _ReviewUpdateDTOCheck = Assert<
    IsExact<ReviewUpdateDTO, ReviewUpdateShape>
>;
type _ReviewParamsDTOCheck = Assert<
    IsExact<ReviewParamsDTO, ReviewParamsShape>
>;
type _ReviewFilmParamsDTOCheck = Assert<
    IsExact<ReviewFilmParamsDTO, Pick<ReviewParamsShape, 'filmID'>>
>;
type _ReviewUserParamsDTOCheck = Assert<
    IsExact<ReviewUserParamsDTO, Pick<ReviewParamsShape, 'userID'>>
>;
