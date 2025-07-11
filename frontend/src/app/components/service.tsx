import React, { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { fetchWithAuth } from '../utils/functions';
import { toast, ToastContainer } from 'react-toastify';

export type Service = {
    id: number;
    name: string;
    price: number;
};

const PAGE_SIZE = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 20;

const ServiceList: React.FC = () => {
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false)

    const fetchServices = useCallback(async () => {
        setIsLoading(true);
        const response: any = await fetchWithAuth(`/service?page=${page}&pageSize=${PAGE_SIZE}`);
        if (!response) {
            throw new Error("Failed to fetch services");
        }

        setServiceList(response.data.services);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
    }, [page]);

    const updateServicePrice = useCallback(async (id: number, price: number) => {
        setIsLoading(true);
        try {
            const response: any = await fetchWithAuth(`/service`, {}, 'PATCH', {
                id,
                price
            });
            if (!response) {
                throw new Error("Failed to update service price");
            }
        } catch (error) {
            console.error("Error updating service price:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setEditPrice(service.price);
    };

    const handleSave = (id: number) => {
        updateServicePrice(id, editPrice)
        // Reset editing state
        setEditingId(null);
        fetchServices();

    };

    const handleCancel = () => {
        setEditingId(null);
    };

    // const totalPages = Math.ceil(services.length / PAGE_SIZE);
    // const pagedServices = services.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        isLoading ? (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        ) :
            <div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>ID</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Name</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Price ($)</th>
                            <th style={{ border: '1px solid #ccc', padding: 8 }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serviceList?.map((service) => (
                            <tr key={service.id}>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{service.id}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>{service.name}</td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                    {editingId === service.id ? (
                                        <input
                                            type="number"
                                            value={editPrice}
                                            min={0}
                                            onChange={(e) => setEditPrice(Number(e.target.value))}
                                            style={{ width: '80px' }}
                                        />
                                    ) : (
                                        service.price
                                    )}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                                    {editingId === service.id ? (
                                        <>
                                            <button
                                                className='text-green-600 hover:text-green-800'
                                                onClick={() => handleSave(service.id)}
                                                title="Save"
                                                style={{ marginRight: 8 }}
                                            >
                                                <FaSave />
                                            </button>
                                            <button
                                                className='text-red-600 hover:text-red-800'
                                                onClick={handleCancel}
                                                title="Cancel"
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className='text-blue-600 hover:text-blue-800'
                                            onClick={() => handleEdit(service)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4cho">
                    <button
                        className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ marginRight: 8 }}
                    >
                        Prev
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className='px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200'
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}

                    >
                        Next
                    </button>
                </div>
            </div>
    );
};

export default ServiceList;
