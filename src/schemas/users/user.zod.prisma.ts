/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Exact } from '@prisma/client/runtime/client';
import type {
    ProfileCreateWithoutUserInput,
    ProfileModel,
    UserCreateInput,
    UserModel,
} from '../../../generated/prisma/models.ts';
import type { Assert, IsExact } from '../../types/tools.ts';
import type { Review } from '../reviews/review.schema.ts';
import type {
    LoginUserDTO,
    ProfileCreateDTO,
    ProfileUpdateDTO,
    RegisterUserDTO,
    UserUpdateDTO,
} from './user.dto.ts';
import type {
    FullUserCredentials,
    Profile,
    User,
    UserCredentials,
    UserWithProfile,
} from '../users/user.schema.ts';

type ProfileShape = Omit<ProfileModel, 'id'>;
type _ProfileCheck = Assert<IsExact<Profile, ProfileShape>>;
type _ProfileCreateDTOCheck = Assert<
    IsExact<ProfileCreateDTO, ProfileCreateWithoutUserInput>
>;
type _ProfileUpdateDTOCheck = Assert<
    IsExact<ProfileUpdateDTO, Partial<ProfileCreateWithoutUserInput>>
>;
type UserCredentialsShape = Omit<UserModel, 'password'>;
type UserModelShape = UserCredentialsShape & {
    profile?: Omit<ProfileModel, 'id'>;
    reviews?: Review[];
};
type UserWithProfileShape = UserModelShape & {
    profile: Omit<ProfileModel, 'id'>;
};
type _FullUserCredentials = Assert<IsExact<FullUserCredentials, UserModel>>;
type _UserCheck = Assert<IsExact<User, UserModelShape>>;
type _UserCredentialsCheck = Assert<
    IsExact<UserCredentials, UserCredentialsShape>
>;
type _UserWithProfile = Assert<IsExact<UserWithProfile, UserWithProfileShape>>;
type LoginUserShape = Pick<UserCreateInput, 'email' | 'password'>;
type RegisterUserShape = Pick<UserCreateInput, 'email' | 'password'> & {
    role?: UserCreateInput['role'];
    profile: ProfileCreateWithoutUserInput;
};
interface UserUpdateShape {
    email?: UserCreateInput['email'];
    password?: UserCreateInput['password'];
    role?: UserCreateInput['role'];
    // profile?: OptionalsUndefined<ProfileCreateWithoutUserInput> | undefined;
}
type _RegisterUserDTOCheck = Assert<
    IsExact<RegisterUserDTO, RegisterUserShape>
>;
type _LoginUserDTOCheck = Assert<IsExact<LoginUserDTO, LoginUserShape>>;
type _UserUpdateDTOCheck = Assert<IsExact<UserUpdateDTO, UserUpdateShape>>;
