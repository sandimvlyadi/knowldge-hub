import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    name?: string;
}

export default function AppLogo(props: AppLogoProps) {
    const { name } = props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-full">
                <AppLogoIcon className="size-6 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name || 'Laravel Starter Kit'}
                </span>
            </div>
        </>
    );
}
