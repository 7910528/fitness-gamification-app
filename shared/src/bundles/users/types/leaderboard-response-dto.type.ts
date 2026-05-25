type LeaderboardItemDto = {
    id: number;
    email: string;
    fullName: string | null;
    username: string | null;
    avatarUrl: string | null;
    bonusBalance: number;
    level: number | null;
    rank: number;
};

type LeaderboardResponseDto = {
    items: LeaderboardItemDto[];
    totalCount: number;
    currentUserRank: number | null;
};

export { type LeaderboardItemDto, type LeaderboardResponseDto };
