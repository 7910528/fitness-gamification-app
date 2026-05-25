import { type BadgeResponseDto } from 'shared';

import { Loader } from '~/bundles/common/components/components.js';
import { DataStatus } from '~/bundles/common/enums/enums.js';
import { type ValueOf } from '~/bundles/common/types/types.js';

type Properties = {
    badges: BadgeResponseDto[];
    dataStatus: ValueOf<typeof DataStatus>;
    className?: string;
};

const UserBadges = ({
    badges,
    dataStatus,
    className,
}: Properties): JSX.Element => {
    const isLoading = dataStatus === DataStatus.PENDING;

    return (
        <div
            className={`bg-primary flex flex-col gap-4 rounded-xl p-4 ${className ?? ''}`}
        >
            <h3 className="text-primary text-xl font-bold">My badges</h3>
            {isLoading ? (
                <div className="flex h-24 items-center justify-center">
                    <Loader />
                </div>
            ) : badges.length === 0 ? (
                <p className="text-lm-grey-200 text-sm">
                    You don&#39;t have any badges yet. Complete achievements to
                    earn them!
                </p>
            ) : (
                <ul className="flex flex-wrap gap-4">
                    {badges.map((badge) => (
                        <li
                            key={badge.id}
                            className="bg-secondary flex w-24 flex-col items-center gap-2 rounded-lg p-2"
                            title={badge.achievementName ?? ''}
                        >
                            <img
                                src={badge.url}
                                alt={badge.achievementName ?? 'badge'}
                                className="h-16 w-16 object-contain"
                            />
                            {badge.achievementName && (
                                <span className="text-primary line-clamp-2 text-center text-[0.65rem]">
                                    {badge.achievementName}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export { UserBadges };
