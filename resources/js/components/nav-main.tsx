import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';

function NavMenuItems({
    items,
    depth = 0,
}: {
    items: NavItem[];
    depth?: number;
}) {
    const page = usePage();

    const isItemActive = (item: NavItem): boolean => {
        if (typeof item.href === 'string') {
            return page.url.startsWith(item.href);
        }
        return page.url.startsWith(item.href.url);
    };

    const hasActiveChild = (item: NavItem): boolean => {
        if (!item.children) return false;
        return item.children.some(
            (child) => isItemActive(child) || hasActiveChild(child),
        );
    };

    return (
        <>
            {items.map((item) => {
                const isActive = isItemActive(item);
                const hasChildren = item.children && item.children.length > 0;
                const hasActiveChildren = hasActiveChild(item);

                if (hasChildren) {
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={hasActiveChildren}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: item.title }}
                                        isActive={isActive || hasActiveChildren}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <NavMenuItems
                                            items={item.children!}
                                            depth={depth + 1}
                                        />
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                if (depth > 0) {
                    return (
                        <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    );
                }

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </>
    );
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                <NavMenuItems items={items} />
            </SidebarMenu>
        </SidebarGroup>
    );
}
