'use client';
import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

type Booking = {
    id: number;
    customer: string;
    address: string;
    phone: string;
    email: string;
    service: 'Cleaning' | 'Cooking';
    date: string;
    from: string;
    to: string;
    status: 'Paid' | 'work in progress' | 'done';
};

const SERVICE_OPTIONS = ['Cleaning', 'Cooking'] as const;
const STATUS_OPTIONS = ['Paid', 'work in progress', 'done'] as const;
const PAGE_SIZE = 20;

// Dummy data for demonstration
const generateBookings = (count: number): Booking[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        customer: `Customer ${i + 1}`,
        address: `Address ${i + 1}`,
        phone: `012345678${i}`,
        email: `customer${i + 1}@mail.com`,
        service: SERVICE_OPTIONS[i % 2],
        date: `2024-06-${(i % 30) + 1}`.padStart(10, '0'),
        from: '09:00',
        to: '17:00',
        status: STATUS_OPTIONS[i % 3],
    }));

const Booking: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>(generateBookings(53));
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Booking>>({});
    const [page, setPage] = useState(1);

    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const pagedBookings = bookings.slice(startIdx, endIdx);
    const totalPages = Math.ceil(bookings.length / PAGE_SIZE);

    const handleEdit = (id: number) => {
        setEditingId(id);
        const booking = bookings.find(b => b.id === id);
        setEditData({ ...booking });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleSave = () => {
        setBookings(prev =>
            prev.map(b =>
                b.id === editingId ? { ...b, ...editData } as Booking : b
            )
        );
        setEditingId(null);
        setEditData({});
    };

    const handleChange = (field: keyof Booking, value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Booking List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded shadow">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="py-2 px-3 border">ID</th>
                            <th className="py-2 px-3 border">Customer</th>
                            <th className="py-2 px-3 border">Address</th>
                            <th className="py-2 px-3 border">Phone</th>
                            <th className="py-2 px-3 border">Email</th>
                            <th className="py-2 px-3 border">Service</th>
                            <th className="py-2 px-3 border">Date</th>
                            <th className="py-2 px-3 border">From</th>
                            <th className="py-2 px-3 border">To</th>
                            <th className="py-2 px-3 border">Status</th>
                            <th className="py-2 px-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedBookings.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="py-2 px-3 border">{booking.id}</td>
                                {editingId === booking.id ? (
                                    <>
                                        <td className="py-2 px-3 border">
                                            <input
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.customer ?? ''}
                                                onChange={e => handleChange('customer', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.address ?? ''}
                                                onChange={e => handleChange('address', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.phone ?? ''}
                                                onChange={e => handleChange('phone', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.email ?? ''}
                                                onChange={e => handleChange('email', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <select
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.service ?? ''}
                                                onChange={e => handleChange('service', e.target.value)}
                                            >
                                                {SERVICE_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                type="date"
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.date ?? ''}
                                                onChange={e => handleChange('date', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                type="time"
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.from ?? ''}
                                                onChange={e => handleChange('from', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                type="time"
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.to ?? ''}
                                                onChange={e => handleChange('to', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <select
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.status ?? ''}
                                                onChange={e => handleChange('status', e.target.value)}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-2 px-3 border flex gap-2">
                                            <button
                                                className="text-green-600 hover:text-green-800"
                                                onClick={handleSave}
                                                aria-label="Save"
                                            >
                                                <FaSave />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800"
                                                onClick={handleCancel}
                                                aria-label="Cancel"
                                            >
                                                <FaTimes />
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-2 px-3 border">{booking.customer}</td>
                                        <td className="py-2 px-3 border">{booking.address}</td>
                                        <td className="py-2 px-3 border">{booking.phone}</td>
                                        <td className="py-2 px-3 border">{booking.email}</td>
                                        <td className="py-2 px-3 border">{booking.service}</td>
                                        <td className="py-2 px-3 border">{booking.date}</td>
                                        <td className="py-2 px-3 border">{booking.from}</td>
                                        <td className="py-2 px-3 border">{booking.to}</td>
                                        <td className="py-2 px-3 border">{booking.status}</td>
                                        <td className="py-2 px-3 border">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => handleEdit(booking.id)}
                                                aria-label="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Booking;