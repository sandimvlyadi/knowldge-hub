import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { ReactNode } from 'react';

interface FormSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
    onSave: () => void;
    onDelete?: () => void;
    loading?: boolean;
    state?: 'add' | 'edit';
}

export function FormSheet({
    open,
    onOpenChange,
    title,
    description,
    children,
    onSave,
    onDelete,
    loading = false,
    state = 'add',
}: FormSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5">
                <SheetHeader className="shadow-lg">
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description || ' '}</SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 overflow-auto p-4">{children}</div>
                <SheetFooter className="border-t-2">
                    <Button
                        type="button"
                        className="cursor-pointer bg-teal-600 hover:bg-teal-700"
                        onClick={onSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner /> Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                    {state === 'edit' && onDelete && (
                        <Button
                            type="button"
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={onDelete}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner /> Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    )}
                    <SheetClose asChild>
                        <Button variant="outline" className="cursor-pointer">
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
