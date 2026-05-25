const UsersApiPath = {
    ROOT: '/',
    CURRENT: '/current',
    UPDATE_USER: '/update',
    GET_BY_ID: '/:id',
    CURRENT_BONUSES: '/current-bonuses',
    UPLOAD_AVATAR: '/upload',
    LEADERBOARD: '/leaderboard',
    STREAK: '/streak',
} as const;

export { UsersApiPath };
