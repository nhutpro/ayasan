'use client';
import React, { use, useCallback, useEffect, useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { fetchWithAuth, formatYYYYMMDDToUTC, formatHHmmToUTC } from '../utils/functions';
import { Service } from './service';
import moment from 'moment';

type Booking = {
    id: number;
    customerName: string;
    address: string;
    phone: string;
    email: string;
    serviceId: number;
    service: Service;
    date: string;
    from: string;
    to: string;
    status: 'Paid' | 'work in progress' | 'done';
};

const SERVICE_OPTIONS = ['Cleaning', 'Cooking'] as const;
const STATUS_OPTIONS = ['Paid', 'Work In Progress', 'Done'] as const;
const PAGE_SIZE = 20;


const Booking: React.FC = () => {
    const [bookingList, setBookingList] = useState<Booking[]>([]);
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Booking>>({});
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false)

    const fetchBookingAndService = useCallback(async () => {
        setIsLoading(true);
        const [bookingResponse, serviceResponse]: any = await Promise.all([
            fetchWithAuth(`/booking?page=${page}&pageSize=${PAGE_SIZE}`),
            fetchWithAuth(`/service?isAll=true`)
        ]);
        setBookingList(bookingResponse.data.bookings);
        setServiceList(serviceResponse.data.services);
        setTotalPages(bookingResponse.data.totalPages);
        setIsLoading(false);
    }, [page]);

    useEffect(() => {
        fetchBookingAndService();
    }, [fetchBookingAndService]);

    const handleEdit = (booking: Booking) => {
        setEditingId(booking.id);
        setEditData({ ...booking });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleSave = async () => {
        const { date, from, to, ...restData } = editData;
        const updateData = await fetchWithAuth('/booking', {}, 'PATCH', {
            id: editingId,
            ...restData,
            date: formatYYYYMMDDToUTC(date),
            from: formatHHmmToUTC(from),
            to: formatHHmmToUTC(to),
        });

        if (!updateData) {
            throw new Error("Failed to update booking");
        }
        setEditingId(null);
        setEditData({});
        fetchBookingAndService();
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
                        {bookingList.map(booking => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="py-2 px-3 border">{booking.id}</td>
                                {editingId === booking.id ? (
                                    <>
                                        <td className="py-2 px-3 border">
                                            <input
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.customerName ?? ''}
                                                onChange={e => handleChange('customerName', e.target.value)}
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
                                                value={editData.serviceId ?? ''}
                                                onChange={e => handleChange('serviceId', e.target.value)}
                                            >
                                                {serviceList.map(opt => (
                                                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                type="date"
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.date}
                                                onChange={e => handleChange('date', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                type="time"
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.from}
                                                onChange={e => handleChange('from', e.target.value)}
                                            />
                                        </td>
                                        <td className="py-2 px-3 border">
                                            <input
                                                type="time"
                                                className="border rounded px-2 py-1 w-full"
                                                value={editData.to}
                                                onChange={e => { return handleChange('to', e.target.value) }}
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
                                        <td className="py-2 px-3 border">{booking.customerName}</td>
                                        <td className="py-2 px-3 border">{booking.address}</td>
                                        <td className="py-2 px-3 border">{booking.phone}</td>
                                        <td className="py-2 px-3 border">{booking.email}</td>
                                        <td className="py-2 px-3 border">{booking.service.name}</td>
                                        <td className="py-2 px-3 border">{booking.date}</td>
                                        <td className="py-2 px-3 border">{booking.from}</td>
                                        <td className="py-2 px-3 border">{booking.to}</td>
                                        <td className="py-2 px-3 border">{booking.status}</td>
                                        <td className="py-2 px-3 border">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => handleEdit(booking)}
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

