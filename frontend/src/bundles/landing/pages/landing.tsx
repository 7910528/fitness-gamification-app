import { actions as appActions } from '~/app/store/app.js';
import {
    Button,
    ButtonVariant,
    Icon,
    Link,
    Navigate,
} from '~/bundles/common/components/components.js';
import { IconColor } from '~/bundles/common/components/icon/enums/enums.js';
import { ComponentSize } from '~/bundles/common/enums/component-size.enum.js';
import { AppRoute } from '~/bundles/common/enums/enums.js';
import { getValidClassNames } from '~/bundles/common/helpers/helpers.js';
import {
    useAppDispatch,
    useAppSelector,
    useCallback,
} from '~/bundles/common/hooks/hooks.js';

import { Fade } from '../components/components.js';

const Landing = (): JSX.Element => {
    const { user } = useAppSelector(({ auth }) => auth);
    const dispatch = useAppDispatch();

    const handleSignIn = useCallback((): void => {
        dispatch(appActions.navigate(AppRoute.SIGN_IN));
    }, [dispatch]);

    const handleSignUp = useCallback((): void => {
        dispatch(appActions.navigate(AppRoute.SIGN_UP));
    }, [dispatch]);

    const styles = {
        section: 'flex flex-col min-h-screen shrink-0 snap-start snap-always',
        container: 'container mx-auto',
        secondSection: {
            gradient:
                'after:absolute after:right-1/2 after:bottom-28 after:h-[39rem] after:w-[42rem] after:translate-x-1/2 after:translate-y-1/2 after:rounded-full after:bg-gradient-to-b after:from-[#E6E345] after:to-[#A1EE7D] after:opacity-20 after:blur-[100px]',
        },
        thirdSection: {
            gradient:
                'after:absolute after:bottom-0 after:left-0 after:-translate-x-1/4 after:translate-y-1/3 after:size-[22rem] after:z-[-1] after:rounded-full after:bg-gradient-to-b after:from-[#E6E345] after:to-[#A1EE7D] after:blur-[140px]',
        },
    };

    if (user) {
        return <Navigate to={AppRoute.OVERVIEW} />;
    }

    return (
        <main className="text-primary flex h-screen snap-y snap-mandatory flex-col gap-40 overflow-y-auto overflow-x-hidden">
            <section
                className={getValidClassNames(styles.section, styles.container)}
            >
                <header className="container mx-auto my-6 flex flex-row items-center justify-between">
                    <div>
                        <Link to={AppRoute.ROOT}>
                            <span className="text-buttonPrimary font-heavybold text-[3.5rem] leading-[4rem]">
                                StayFit
                            </span>
                        </Link>
                    </div>
                    <Button
                        size={ComponentSize.MEDIUM}
                        label="Sign In"
                        variant={ButtonVariant.PRIMARY}
                        className="basis-40"
                        onClick={handleSignIn}
                    />
                </header>
                <div className="flex flex-1 flex-col items-center justify-evenly gap-28 md:gap-0 lg:flex-row lg:justify-between">
                    <div className="md:w-[30rem] xl:w-[32rem]">
                        <div className="bg-secondary mb-[0.375rem] inline-block rounded-2xl px-4 py-2">
                            <p className="text-base font-bold leading-4">
                                <span className="mr-2 inline-flex items-baseline">
                                    <Icon
                                        name="workoutIcon"
                                        color={IconColor.PRIMARY}
                                        className="fill-lm-yellow-100 size-3"
                                    />
                                </span>
                                Stay Fit. Stay Strong.
                            </p>
                        </div>
                        <h1 className="font-heavybold mb-[1.5rem] text-[3.5rem] leading-[4rem]">
                            Train smarter. Grow stronger.
                        </h1>
                        <p className="mb-[2rem] text-base font-bold">
                            StayFit turns every workout into measurable
                            progress. Track sessions, earn rewards, climb the
                            leaderboard and watch your streak grow day after
                            day.
                        </p>
                        <div className="flex flex-row gap-3">
                            <Button
                                size={ComponentSize.MEDIUM}
                                label="Get Fit Now"
                                variant={ButtonVariant.PRIMARY}
                                onClick={handleSignUp}
                                className="max-w-[13rem]"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute right-0 top-0 z-[-1] -translate-y-1/2 translate-x-1/2">
                            <Fade
                                className="bg-buttonPrimary size-[11.625rem] rounded-full"
                                x={75}
                            />
                        </div>
                        <div className="h-[22rem] w-[22rem] md:w-[30rem]"></div>
                        <div className="absolute bottom-0 left-0 z-[-1] -translate-x-1/2 translate-y-1/2">
                            <Fade
                                className="bg-buttonPrimary size-[18.5rem] rounded-full"
                                x={-75}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export { Landing };
