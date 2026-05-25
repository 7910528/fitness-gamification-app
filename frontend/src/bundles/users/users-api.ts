import { type LeaderboardResponseDto } from 'shared';

import { ApiPath, ContentType } from '~/bundles/common/enums/enums.js';
import { type Http } from '~/framework/http/http.js';
import { BaseHttpApi } from '~/framework/http-api/http-api.js';
import { type Storage } from '~/framework/storage/storage.js';

import { UsersApiPath } from './enums/enums.js';
import {
    type UserAuthResponseDto,
    type UserBonusGetAllResponseDto,
    type UserGetAllResponseDto,
    type UserUpdateProfileRequestDto,
    type UserUploadAvatarResponseDto,
} from './types/types.js';

type Constructor = {
    baseUrl: string;
    http: Http;
    storage: Storage;
};

class UserApi extends BaseHttpApi {
    public constructor({ baseUrl, http, storage }: Constructor) {
        super({ path: ApiPath.USERS, baseUrl, http, storage });
    }

    public async getAll(): Promise<UserGetAllResponseDto> {
        const response = await this.load(
            this.getFullEndpoint(UsersApiPath.ROOT, {}),
            {
                method: 'GET',
                contentType: ContentType.JSON,
                hasAuth: true,
            },
        );

        return await response.json<UserGetAllResponseDto>();
    }

    public async getById(id: string): Promise<UserAuthResponseDto> {
        const response = await this.load(
            this.getFullEndpoint(UsersApiPath.GET_BY_ID, { id }),
            {
                method: 'GET',
                contentType: ContentType.JSON,
                hasAuth: true,
            },
        );

        return await response.json<UserAuthResponseDto>();
    }

    public async refreshUser(): Promise<UserAuthResponseDto> {
        const response = await this.load(
            this.getFullEndpoint(UsersApiPath.CURRENT, {}),
            {
                method: 'GET',
                contentType: ContentType.JSON,
                hasAuth: true,
            },
        );

        return await response.json<UserAuthResponseDto>();
    }

    public async updateUser(
        payload: UserUpdateProfileRequestDto,
    ): Promise<UserAuthResponseDto> {
        const response = await this.load(
            this.getFullEndpoint(UsersApiPath.UPDATE_USER, {}),
            {
                method: 'PATCH',
                contentType: ContentType.JSON,
                payload: JSON.stringify(payload),
                hasAuth: true,
            },
        );

        return await response.json<UserAuthResponseDto>();
    }

    public async getUserBonuses(): Promise<UserBonusGetAllResponseDto> {
        const response = await this.load(
            this.getFullEndpoint(UsersApiPath.CURRENT_BONUSES, {}),
            {
                method: 'GET',
                contentType: ContentType.JSON,
                hasAuth: true,
            },
        );
        return await response.json<UserBonusGetAllResponseDto>();
    }

    public async getLeaderboard(payload: {
        page: number;
        limit: number;
        friendsOnly: boolean;
    }): Promise<LeaderboardResponseDto> {
        const { page, limit, friendsOnly } = payload;
        const url = `${this.getFullEndpoint(UsersApiPath.LEADERBOARD, {})}?page=${page}&limit=${limit}&friendsOnly=${friendsOnly}`;
        const response = await this.load(url, {
            method: 'GET',
            contentType: ContentType.JSON,
            hasAuth: true,
        });
        return await response.json<LeaderboardResponseDto>();
    }

    public async getStreak(payload?: {
        userId?: number;
    }): Promise<{ userId: number; streak: number }> {
        const tzOffset = new Date().getTimezoneOffset();
        const parameters = new URLSearchParams();
        parameters.set('tzOffset', String(tzOffset));
        if (payload?.userId) {
            parameters.set('userId', String(payload.userId));
        }
        const url = `${this.getFullEndpoint(UsersApiPath.STREAK, {})}?${parameters.toString()}`;
        const response = await this.load(url, {
            method: 'GET',
            contentType: ContentType.JSON,
            hasAuth: true,
        });
        return await response.json<{ userId: number; streak: number }>();
    }

    public async uploadAvatar(
        payload: File,
    ): Promise<UserUploadAvatarResponseDto> {
        const imageData = new FormData();
        imageData.append('image', payload);

        const response = await this.load(
            this.getFullEndpoint(UsersApiPath.UPLOAD_AVATAR, {}),
            {
                method: 'POST',
                payload: imageData,
                hasAuth: true,
            },
        );

        return response.json<UserUploadAvatarResponseDto>();
    }
}

export { UserApi };
