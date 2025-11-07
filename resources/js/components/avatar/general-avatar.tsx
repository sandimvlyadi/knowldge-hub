import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface GeneralAvatarProps {
    avatar?: string;
    keyName?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
};

export function GeneralAvatar({
    avatar,
    keyName,
    size = 'md',
}: GeneralAvatarProps) {
    if (!avatar) return null;

    return (
        <Avatar className={`${sizeClasses[size]} border shadow`}>
            <AvatarImage src={avatar} alt="General Avatar" />
            <AvatarFallback>{keyName || 'N/A'}</AvatarFallback>
        </Avatar>
    );
}
