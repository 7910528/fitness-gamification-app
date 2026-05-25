import { createAsyncThunk } from '@reduxjs/toolkit';
import { type LeaderboardResponseDto } from 'shared';

import { type AsyncThunkConfig } from '~/bundles/common/types/types.js';

import { name as sliceName } from './slice.js';

type GetLeaderboardArgument = {
    page: number;
    limit: number;
    friendsOnly: boolean;
};

const getLeaderboard = createAsyncThunk<
    LeaderboardResponseDto,
    GetLeaderboardArgument,
    AsyncThunkConfig
>(`${sliceName}/get`, async (payload, { extra }) => {
    const { userApi } = extra;
    return await userApi.getLeaderboard(payload);
});

export { type GetLeaderboardArgument as GetLeaderboardArg, getLeaderboard };
