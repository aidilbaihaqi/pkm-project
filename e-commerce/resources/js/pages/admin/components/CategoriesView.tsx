import { useState } from 'react';
import { PlusSquare, RefreshCw, ShieldX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '../types';
import { getCsrfToken } from '../utils';

export const CategoriesView = ({ categories, fetchCategories }: { categories: Category[], fetchCategories: () => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
            const method = editingCategory ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(formData),
            });

            setIsModalOpen(false);
            fetchCategories();
            setFormData({ name: '', description: '' });
            setEditingCategory(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus kategori ini?')) return;
        try {
            await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: { 'X-XSRF-TOKEN': getCsrfToken() },
            });
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daftar Kategori</h2>
                <Button onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '' }); setIsModalOpen(true); }} className="bg-umkm-orange">
                    <PlusSquare className="h-4 w-4 mr-2" /> Tambah Kategori
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                    <div key={cat.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cat.description || 'Tidak ada deskripsi'}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">
                                /{cat.slug}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => {
                                setEditingCategory(cat);
                                setFormData({ name: cat.name, description: cat.description || '' });
                                setIsModalOpen(true);
                            }}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDelete(cat.id)}>
                                <ShieldX className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Simple implementation */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nama</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deskripsi</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent p-2 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                                <Button type="submit" disabled={loading} className="bg-umkm-orange">{loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Simpan'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
