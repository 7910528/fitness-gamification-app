import { Oval } from 'react-loader-spinner';

import { getValidClassNames } from '~/bundles/common/helpers/helpers.js';

type Properties = {
    isOverflow?: boolean;
};

const Loader: React.FC<Properties> = ({ isOverflow }): JSX.Element => {
    const spinner = (
        <>
            <span aria-hidden="true">
                <Oval
                    height={40}
                    width={40}
                    color="rgb(255 90 31)"
                    visible={true}
                />
            </span>
            <span className="sr-only">Loading...</span>
        </>
    );
    const classNames = isOverflow
        ? 'absolute flex h-full w-full items-center justify-center'
        : 'inline';

    return <div className={getValidClassNames(classNames)}>{spinner}</div>;
};

export { Loader };
