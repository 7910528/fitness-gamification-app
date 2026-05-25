import { Cog6ToothIcon } from '@heroicons/react/24/solid';

import { Avatar, Link } from '~/bundles/common/components/components.js';
import { AppRoute } from '~/bundles/common/enums/enums.js';

import { NotificationComponent } from '../notifications/notification-component.js';
import styles from './styles.module.css';

type Properties = {
    email: string;
    avatarUrl?: string | null;
    level?: number | null;
    streak?: number | null;
};

const Navigation: React.FC<Properties> = ({
    email,
    avatarUrl,
    level,
    streak,
}): JSX.Element => {
    return (
        <nav className={styles['navigation']}>
            <ul className={styles['menu-list']}>
                <li>
                    <NotificationComponent />
                </li>
                <li>
                    <Link to={AppRoute.PROFILE_INFORMATION}>
                        <Cog6ToothIcon className={styles['icon']} />
                    </Link>
                </li>
                {streak != null && streak > 0 && (
                    <li>
                        <span
                            title={`Workout streak: ${streak} day${streak === 1 ? '' : 's'} in a row`}
                            className="text-primary inline-flex h-7 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 text-xs font-bold"
                        >
                            <span aria-hidden>🔥</span>
                            {streak}
                        </span>
                    </li>
                )}
                {level != null && (
                    <li>
                        <span
                            title="Your level"
                            className="bg-buttonPrimary text-primary inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-full px-2 text-xs font-bold"
                        >
                            LVL {level}
                        </span>
                    </li>
                )}
                <li>
                    <Avatar
                        size="sm"
                        email={email}
                        avatarUrl={avatarUrl || null}
                    />
                </li>
            </ul>
        </nav>
    );
};

export { Navigation };
