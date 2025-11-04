import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from './ui/drawer';
import { ScrollArea } from './ui/scroll-area';

interface ModalFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: ReactNode;
    className?: string;
    title?: string;
    description?: string;
    withCloseButton?: boolean;
}

export function ModalForm(props: ModalFormProps) {
    const {
        open,
        setOpen,
        children,
        className,
        title,
        description,
        withCloseButton = false,
    } = props;
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="mt-auto flex flex-col gap-2 p-4">
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerDescription>{description}</DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-[70vh] w-full pb-15">
                        {children}
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                withCloseButton={withCloseButton}
                className={cn('sm:max-w-xl z-1000', className)}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-center">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] w-full">
                    {children}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
