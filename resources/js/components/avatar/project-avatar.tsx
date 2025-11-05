import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ProjectAvatarProps {
    avatar?: string;
    keyName?: string;
    archived?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
};

export function ProjectAvatar({
    avatar,
    keyName,
    archived,
    size = 'md',
}: ProjectAvatarProps) {
    if (!avatar) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-1">
            <Avatar className={`${sizeClasses[size]} border shadow`}>
                <AvatarImage src={avatar} alt="Project Avatar" />
                <AvatarFallback>{keyName || 'N/A'}</AvatarFallback>
            </Avatar>
            {archived !== undefined && (
                <Badge className={archived ? 'bg-red-600' : 'bg-green-600'}>
                    {archived ? 'Archived' : 'Active'}
                </Badge>
            )}
        </div>
    );
}
