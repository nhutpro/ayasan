'use client';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchWithAuth, logout } from '../utils/functions';
import { Formik } from 'formik';

type Announcement = {
    id: number;
    title: string;
    content: string; // HTML string
    createdDate: string;
    author: string;
};

const PAGE_SIZE = process.env.PAGE_SIZE ? Number(process.env.PAGE_SIZE) : 20;

const Announcement: React.FC = () => {
    const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);
    const [editId, setEditId] = useState<number | null>(null);
    const [editRow, setEditRow] = useState<Partial<Announcement>>({});
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [totalPage, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Show/hide create form
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Paging state
    const [page, setPage] = useState(1);


    const fetchAnnouncements = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/announcement?page=${page}&pageSize=${PAGE_SIZE}`);
            console.log('Fetched announcements:', response.data);
            setAnnouncementList(response.data.data.announcements);
            setTotalPages(response.data.data.totalPages);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            logout();
            return;
        }
    }, [page]);

    useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements]);

    const updateAnnouncement = useCallback(async (announcement: Partial<Announcement>) => {
        try {
            setIsLoading(true);
            const response = await fetchWithAuth(`/announcement`, {}, 'PATCH', {
                ...announcement,
            });
            setIsLoading(false);
        } catch (error) {
            console.error('Error updating announcement:', error);
            logout();
            return;
        }

    }, []);

    const handleEditChange = (field: keyof Announcement, value: string) => {
        setEditRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleEdit = (announcement: Announcement) => {
        setEditId(announcement.id);
        setEditRow({
            title: announcement.title,
            content: announcement.content,
            createdDate: announcement.createdDate,
            author: announcement.author,
        });
    };

    const handleSave = () => {
        updateAnnouncement({
            id: editId!,
            title: editRow.title,
            content: editRow.content,
            author: editRow.author,
        });
        setEditId(null);
        setEditRow({});
        fetchAnnouncements();
    };

    const handleCancel = () => {
        setEditId(null);
        setEditRow({});
    };

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            await fetchWithAuth(`/announcement/${id}`, {}, 'DELETE');
            console.log('Deleted announcement:', id);
            fetchAnnouncements();
            setDeleteId(null);
            setIsLoading(false);
        } catch (error) {
            setDeleteId(null);
            console.error('Error deleting announcement:', error);
            logout();
            return;
        }
    };

    const handleHideCreateForm = () => {
        setShowCreateForm(false);
    };

    return (
        isLoading ? (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        ) :
            <div className="p-6 relative">
                <h2 className="text-2xl font-bold mb-4">Announcements</h2>

                {/* Show Create Button if form is hidden */}
                {!showCreateForm && (
                    <div style={{ display: "flex", justifyContent: "end", alignItems: "center", marginBottom: "16px" }}>
                        <button
                            className="cursor-pointer"
                            style={{
                                padding: "10px 24px",
                                fontSize: "16px",
                                cursor: "pointer",
                                background: "linear-gradient(90deg, #4f8cff 0%, #3358e6 100%)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                boxShadow: "0 2px 8px rgba(79, 140, 255, 0.15)",
                                fontWeight: 600,
                                letterSpacing: "0.5px",
                                transition: "background 0.2s, transform 0.1s",
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = "linear-gradient(90deg, #3358e6 0%, #4f8cff 100%)")}
                            onMouseOut={e => (e.currentTarget.style.background = "linear-gradient(90deg, #4f8cff 0%, #3358e6 100%)")}
                            onClick={() => setShowCreateForm(true)}
                        >
                            <span style={{ marginRight: "8px", fontSize: "18px" }}>＋</span>
                            Create Annoucement
                        </button>
                    </div>
                )}

                {/* Create Announcement Form */}
                {showCreateForm ? (
                    <Formik
                        initialValues={{
                            title: '',
                            content: '',
                            author: '',
                        }}
                        validate={values => {
                            const errors: { title?: string; content?: string; author?: string } = {};
                            if (!values.title) errors.title = 'Required';
                            if (!values.content) errors.content = 'Required';
                            if (!values.author) errors.author = 'Required';
                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                setIsLoading(true);
                                await fetchWithAuth('/announcement', {}, 'POST', values);
                                resetForm();
                                setShowCreateForm(false);
                                setPage(1);
                                fetchAnnouncements();
                            } catch (error) {
                                // Optionally handle error
                            } finally {
                                setIsLoading(false);
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                            <form
                                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mb-8 mt-8"
                                onSubmit={handleSubmit}
                            >
                                <h3 className="text-lg font-semibold mb-4">Create Announcement</h3>
                                <div className="mb-3">
                                    <label className="block mb-1 font-medium">Title</label>
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        name="title"
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.title && touched.title && (
                                        <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="block mb-1 font-medium">Content (HTML allowed)</label>
                                    <textarea
                                        className="border rounded px-2 py-1 w-full"
                                        rows={4}
                                        name="content"
                                        value={values.content}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="<p>HTML content here</p>"
                                    />
                                    {errors.content && touched.content && (
                                        <div className="text-red-500 text-sm mt-1">{errors.content}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="block mb-1 font-medium">Author</label>
                                    <input
                                        className="border rounded px-2 py-1 w-full"
                                        name="author"
                                        value={values.author}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.author && touched.author && (
                                        <div className="text-red-500 text-sm mt-1">{errors.author}</div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        onClick={handleHideCreateForm}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        disabled={
                                            isSubmitting ||
                                            !values.title ||
                                            !values.content ||
                                            !values.author
                                        }
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                ) : <>
                    <div></div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border-b">ID</th>
                                    <th className="px-4 py-2 border-b">Title</th>
                                    <th className="px-4 py-2 border-b">Content</th>
                                    <th className="px-4 py-2 border-b">Created Date</th>
                                    <th className="px-4 py-2 border-b">Author</th>
                                    <th className="px-4 py-2 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcementList?.map((row) => (
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
                                            {moment(row.createdDate).format('YYYY-MM-DD')}
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

                    <div className="flex justify-between items-center mt-4">
                        <button className="cursor-pointer px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            style={{ marginRight: "8px", padding: "6px 12px" }}
                        >
                            Previous
                        </button>
                        <span>
                            Page {page} of {totalPage}
                        </span>
                        <button
                            className="cursor-pointer px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPage}
                            style={{ marginLeft: "8px", padding: "6px 12px" }}
                        >
                            Next
                        </button>
                    </div>


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
                                        onClick={() => handleDelete(deleteId!)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
                }


            </div>
    );
};

export default Announcement;
