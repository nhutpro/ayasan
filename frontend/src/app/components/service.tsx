import React, { useState } from 'react';

type Service = {
    id: number;
    name: string;
    price: number;
};

const initialServices: Service[] = [
    { id: 1, name: 'Cleaning', price: 50 },
    { id: 2, name: 'Cooking', price: 70 },
    { id: 3, name: 'Babysitting', price: 100 },
    // Add more dummy data for demonstration
    ...Array.from({ length: 50 }, (_, i) => ({
        id: i + 4,
        name: `Service ${i + 4}`,
        price: 20 + i,
    })),
];

const PAGE_SIZE = 20;

const ServiceList: React.FC = () => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<number>(0);
    const [page, setPage] = useState<number>(1);

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setEditPrice(service.price);
    };

    const handleSave = (id: number) => {
        setServices((prev) =>
            prev.map((service) =>
                service.id === id ? { ...service, price: editPrice } : service
            )
        );
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const totalPages = Math.ceil(services.length / PAGE_SIZE);
    const pagedServices = services.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>ID</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Name</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Price</th>
                        <th style={{ border: '1px solid #ccc', padding: 8 }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pagedServices.map((service) => (
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
                                            onClick={() => handleSave(service.id)}
                                            title="Save"
                                            style={{ marginRight: 8 }}
                                        >
                                            💾
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            title="Cancel"
                                        >
                                            ❌
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleEdit(service)}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ marginLeft: 8 }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ServiceList;
