import { type BadgeResponseDto, BadgesApiPath } from 'shared';

import { ApiPath, ContentType } from '~/bundles/common/enums/enums.js';
import { type Http } from '~/framework/http/http.js';
import { BaseHttpApi } from '~/framework/http-api/http-api.js';
import { type Storage } from '~/framework/storage/storage.js';

type Constructor = {
    baseUrl: string;
    http: Http;
    storage: Storage;
};

class BadgesApi extends BaseHttpApi {
    public constructor({ baseUrl, http, storage }: Constructor) {
        super({ path: ApiPath.BADGES, baseUrl, http, storage });
    }

    public async getUserBadges(id: string): Promise<BadgeResponseDto[]> {
        const response = await this.load(
            this.getFullEndpoint(BadgesApiPath.USER_ID, { id }),
            {
                method: 'GET',
                contentType: ContentType.JSON,
                hasAuth: true,
            },
        );
        return await response.json<BadgeResponseDto[]>();
    }
}

export { BadgesApi };
