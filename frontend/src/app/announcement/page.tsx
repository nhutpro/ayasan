'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';




type Announcement = {
    id: number;
    title: string;
    content: string;
    createdDate: string;
    updatedDate: string;
    author: string;
};

export default function AnnouncementPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your actual API endpoint
        axios.get(`${process.env.NEXT_PUBLIC_NEXT_BACKEND_URL}/announcement`)
            .then((res) => {
                setAnnouncements(res.data.data.announcements || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">Announcements</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></span>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center text-gray-500">No announcements found.</div>
                ) : (
                    <ul className="space-y-6">
                        {announcements.map((announcement) => (
                            <li
                                key={announcement.id}
                                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-xl font-semibold text-purple-800">{announcement.title}</h2>
                                    <span className="text-xs text-gray-400">
                                        {new Date(announcement.createdDate).toLocaleDateString()} by {announcement.author}
                                    </span>
                                </div>
                                <div
                                    className="text-gray-700 mb-2"
                                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                                />
                                <div className="text-right text-xs text-gray-300">
                                    Updated: {new Date(announcement.updatedDate).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}