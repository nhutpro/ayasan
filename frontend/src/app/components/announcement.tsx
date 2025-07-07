'use client';
import React, { useState } from 'react';

type Announcement = {
    id: number;
    title: string;
    content: string; // HTML string
    excerpt: string;
    createdDate: string;
    author: string;
};

const initialData: Announcement[] = [
    {
        id: 1,
        title: 'System Maintenance',
        content: '<p>We will have a <strong>system maintenance</strong> on Sunday.</p>',
        excerpt: 'System maintenance on Sunday.',
        createdDate: '2024-06-01',
        author: 'Admin',
    },
    {
        id: 2,
        title: 'New Feature Released',
        content: '<ul><li>Feature A</li><li>Feature B</li></ul>',
        excerpt: 'Feature A and B released.',
        createdDate: '2024-06-05',
        author: 'Jane Doe',
    },
];

const Announcement: React.FC = () => {
    const [data, setData] = useState<Announcement[]>(initialData);
    const [editId, setEditId] = useState<number | null>(null);
    const [editRow, setEditRow] = useState<Partial<Announcement>>({});
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Show/hide create form
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Create form state
    const [createRow, setCreateRow] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        excerpt: '',
        author: '',
    });

    const handleEdit = (row: Announcement) => {
        setEditId(row.id);
        setEditRow({ ...row });
    };

    const handleEditChange = (field: keyof Announcement, value: string) => {
        setEditRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setData((prev) =>
            prev.map((item) =>
                item.id === editId ? { ...item, ...editRow, id: item.id } as Announcement : item
            )
        );
        setEditId(null);
        setEditRow({});
    };

    const handleCancel = () => {
        setEditId(null);
        setEditRow({});
    };

    const handleDelete = () => {
        setData((prev) => prev.filter((item) => item.id !== deleteId));
        setDeleteId(null);
    };

    // Create handlers
    const handleCreateChange = (field: keyof Announcement, value: string) => {
        setCreateRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!createRow.title || !createRow.content || !createRow.excerpt || !createRow.author) return;
        const newAnnouncement: Announcement = {
            id: Math.max(0, ...data.map(d => d.id)) + 1,
            title: createRow.title!,
            content: createRow.content!,
            excerpt: createRow.excerpt!,
            createdDate: new Date().toISOString().slice(0, 10),
            author: createRow.author!,
        };
        setData(prev => [newAnnouncement, ...prev]);
        setCreateRow({ title: '', content: '', excerpt: '', author: '' });
        setShowCreateForm(false);
    };

    const handleShowCreateForm = () => {
        setShowCreateForm(true);
    };

    const handleHideCreateForm = () => {
        setShowCreateForm(false);
        setCreateRow({ title: '', content: '', excerpt: '', author: '' });
    };

    return (
        <div className="p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Announcements</h2>

            {/* Show Create Button if form is hidden */}
            {!showCreateForm && (
                <div className="mb-6">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleShowCreateForm}
                    >
                        Create Announcement
                    </button>
                </div>
            )}

            {/* Create Announcement Form */}
            {showCreateForm && (
                <form
                    className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mb-8"
                    onSubmit={handleCreate}
                >
                    <h3 className="text-lg font-semibold mb-4">Create Announcement</h3>
                    <div className="mb-3">
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            value={createRow.title || ''}
                            onChange={e => handleCreateChange('title', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 font-medium">Excerpt</label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            value={createRow.excerpt || ''}
                            onChange={e => handleCreateChange('excerpt', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 font-medium">Content (HTML allowed)</label>
                        <textarea
                            className="border rounded px-2 py-1 w-full"
                            rows={4}
                            value={createRow.content || ''}
                            onChange={e => handleCreateChange('content', e.target.value)}
                            placeholder="<p>HTML content here</p>"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 font-medium">Author</label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            value={createRow.author || ''}
                            onChange={e => handleCreateChange('author', e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={handleHideCreateForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={
                                !createRow.title ||
                                !createRow.content ||
                                !createRow.excerpt ||
                                !createRow.author
                            }
                        >
                            Create
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">Title</th>
                            <th className="px-4 py-2 border-b">Excerpt</th>
                            <th className="px-4 py-2 border-b">Content</th>
                            <th className="px-4 py-2 border-b">Created Date</th>
                            <th className="px-4 py-2 border-b">Author</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b text-center">{row.id}</td>
                                <td className="px-4 py-2 border-b">
                                    {editId === row.id ? (
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            value={editRow.title || ''}
                                            onChange={(e) => handleEditChange('title', e.target.value)}
                                        />
                                    ) : (
                                        row.title
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {editId === row.id ? (
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            value={editRow.excerpt || ''}
                                            onChange={(e) => handleEditChange('excerpt', e.target.value)}
                                        />
                                    ) : (
                                        row.excerpt
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b max-w-xs">
                                    {editId === row.id ? (
                                        <textarea
                                            className="border rounded px-2 py-1 w-full"
                                            rows={3}
                                            value={editRow.content || ''}
                                            onChange={(e) => handleEditChange('content', e.target.value)}
                                        />
                                    ) : (
                                        <div
                                            className="prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: row.content }}
                                        />
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {editId === row.id ? (
                                        <input
                                            type="date"
                                            className="border rounded px-2 py-1 w-full"
                                            value={editRow.createdDate || ''}
                                            onChange={(e) => handleEditChange('createdDate', e.target.value)}
                                        />
                                    ) : (
                                        row.createdDate
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b">
                                    {editId === row.id ? (
                                        <input
                                            className="border rounded px-2 py-1 w-full"
                                            value={editRow.author || ''}
                                            onChange={(e) => handleEditChange('author', e.target.value)}
                                        />
                                    ) : (
                                        row.author
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b text-center">
                                    {editId === row.id ? (
                                        <div className="flex justify-center gap-2">
                                            {/* Save Icon */}
                                            <button
                                                className="text-green-600 hover:text-green-800"
                                                onClick={handleSave}
                                                title="Save"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            {/* Cancel Icon */}
                                            <button
                                                className="text-gray-500 hover:text-gray-700"
                                                onClick={handleCancel}
                                                title="Cancel"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center gap-2">
                                            {/* Edit Icon */}
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => handleEdit(row)}
                                                title="Edit"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2z" />
                                                </svg>
                                            </button>
                                            {/* Delete Icon */}
                                            <button
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => setDeleteId(row.id)}
                                                title="Delete"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                                    viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete this announcement?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setDeleteId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcement;
