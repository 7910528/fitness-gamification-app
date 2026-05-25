import { config } from '~/framework/config/config.js';
import { http } from '~/framework/http/http.js';
import { storage } from '~/framework/storage/storage.js';

import { BadgesApi } from './badges-api.js';

const badgesApi = new BadgesApi({
    baseUrl: config.ENV.API.ORIGIN_URL,
    storage,
    http,
});

export { badgesApi };
export { BadgesApi };
