import { useIsMobile } from '@/hooks/use-mobile';
import { LoaderCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from './ui/drawer';

interface DeleteConfirmationProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
    processing?: boolean;
}

export function DeleteConfirmation(props: DeleteConfirmationProps) {
    const {
        open,
        setOpen,
        onConfirm,
        onCancel,
        message,
        processing = false,
    } = props;
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Delete Confirmation</DrawerTitle>
                        <DrawerDescription>
                            {message ||
                                'Are you sure you want to delete this item?'}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="pt-2">
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onConfirm();
                            }}
                            disabled={processing}
                        >
                            {processing ? (
                                <LoaderCircleIcon className="animate-spin" />
                            ) : null}
                            {processing ? 'Deleting...' : 'Delete'}
                        </Button>
                        <DrawerClose asChild>
                            <Button
                                variant="outline"
                                autoFocus
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Delete Confirmation</DialogTitle>
                    <DialogDescription>
                        {message ||
                            'Are you sure you want to delete this item?'}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                        }}
                        disabled={processing}
                    >
                        {processing ? (
                            <LoaderCircleIcon className="animate-spin" />
                        ) : null}
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            autoFocus
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
