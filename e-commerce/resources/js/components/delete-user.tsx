import { destroy } from '@/actions/App/Http/Controllers/Settings/ProfileController';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@inertiajs/react';

export default function DeleteUser() {
    return (
        <div className="space-y-6">
            <HeadingSmall title="Hapus Akun" description="Hapus akun Anda dan semua data yang terkait" />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Peringatan</p>
                    <p className="text-sm">Harap berhati-hati, tindakan ini tidak dapat dibatalkan.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Hapus Akun</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Apakah Anda yakin ingin menghapus akun?</DialogTitle>
                        <DialogDescription>
                            Setelah akun Anda dihapus, semua data dan sumber daya akan dihapus secara permanen.
                            Harap konfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                        </DialogDescription>
                        <Form
                            {...destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing }) => (
                                <>
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary" onClick={() => resetAndClearErrors()}>
                                                Batal
                                            </Button>
                                        </DialogClose>

                                        <Button variant="destructive" disabled={processing} asChild>
                                            <button type="submit">Hapus Akun</button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
