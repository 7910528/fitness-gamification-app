import { createAsyncThunk } from '@reduxjs/toolkit';
import { type BadgeResponseDto } from 'shared';

import { type AsyncThunkConfig } from '~/bundles/common/types/types.js';

import { name as sliceName } from './slice.js';

const getBadgesByUserId = createAsyncThunk<
    BadgeResponseDto[],
    number,
    AsyncThunkConfig
>(`${sliceName}/get-by-user-id`, async (id, { extra }) => {
    const { badgesApi } = extra;
    return await badgesApi.getUserBadges(String(id));
});

export { getBadgesByUserId };
