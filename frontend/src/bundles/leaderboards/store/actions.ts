import { createAsyncThunk } from '@reduxjs/toolkit';
import { type LeaderboardResponseDto } from 'shared';

import { type AsyncThunkConfig } from '~/bundles/common/types/types.js';

import { name as sliceName } from './slice.js';

type GetLeaderboardArg = {
    page: number;
    limit: number;
    friendsOnly: boolean;
};

const getLeaderboard = createAsyncThunk<
    LeaderboardResponseDto,
    GetLeaderboardArg,
    AsyncThunkConfig
>(`${sliceName}/get`, async (payload, { extra }) => {
    const { userApi } = extra;
    return await userApi.getLeaderboard(payload);
});

export { getLeaderboard, type GetLeaderboardArg };
