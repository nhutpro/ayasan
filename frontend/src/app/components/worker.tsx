import React, { useState } from "react";

type Worker = {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    birthday: string;
    dateCreated: string;
};

const initialWorkers: Worker[] = [
    { id: 1, name: "John Doe", address: "123 Main St", phoneNumber: "123-456-7890", birthday: "1990-01-01", dateCreated: new Date().toLocaleDateString() },
    { id: 2, name: "Jane Smith", address: "456 Oak Ave", phoneNumber: "987-654-3210", birthday: "1992-05-15", dateCreated: new Date().toLocaleDateString() },
    // Add more workers as needed for testing
    // You can generate more dummy data if you want to test paging
];
for (let i = 3; i <= 50; i++) {
    initialWorkers.push({
        id: i,
        name: `Worker ${i}`,
        address: `${i} Main St`,
        phoneNumber: `555-010${i}`,
        birthday: `1990-01-${i < 10 ? "0" : ""}${i}`,
        dateCreated: new Date().toLocaleDateString(),
    });
}

const PAGE_SIZE = 20;

const Worker: React.FC = () => {
    const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
    const [showForm, setShowForm] = useState(false);
    const [newWorker, setNewWorker] = useState<Omit<Worker, "id" | "dateCreated">>({
        name: "",
        address: "",
        phoneNumber: "",
        birthday: "",
    });
    const [page, setPage] = useState(1);

    const handleAddWorker = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nextId = workers.length > 0 ? Math.max(...workers.map(w => w.id)) + 1 : 1;
        setWorkers([
            ...workers,
            {
                id: nextId,
                name: newWorker.name,
                address: newWorker.address,
                phoneNumber: newWorker.phoneNumber,
                birthday: newWorker.birthday,
                dateCreated: new Date().toLocaleDateString(),
            },
        ]);
        setNewWorker({ name: "", address: "", phoneNumber: "", birthday: "" });
        setShowForm(false);
        setPage(Math.ceil((workers.length + 1) / PAGE_SIZE)); // Go to last page
    };

    const totalPages = Math.ceil(workers.length / PAGE_SIZE);
    const pagedWorkers = workers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Worker List</h2>
                <button
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
                    onClick={() => setShowForm(true)}
                >
                    <span style={{ marginRight: "8px", fontSize: "18px" }}>＋</span>
                    Create Worker
                </button>
            </div>
            {showForm ? (
                <form
                    style={{ marginTop: "24px" }}
                    onSubmit={handleAddWorker}
                >
                    <div style={{ marginBottom: "12px" }}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={newWorker.name}
                                onChange={e => setNewWorker({ ...newWorker, name: e.target.value })}
                                required
                                style={{ marginLeft: "8px" }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                        <label>
                            Birthday:
                            <input
                                type="date"
                                value={newWorker.birthday}
                                onChange={e => setNewWorker({ ...newWorker, birthday: e.target.value })}
                                required
                                style={{ marginLeft: "8px" }}
                            />
                        </label>
                        <label>
                            Address:
                            <input
                                type="text"
                                value={newWorker.address}
                                onChange={e => setNewWorker({ ...newWorker, address: e.target.value })}
                                required
                                style={{ marginLeft: "8px" }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                        <label>
                            Phone:
                            <input
                                type="text"
                                value={newWorker.phoneNumber}
                                onChange={e => setNewWorker({ ...newWorker, phoneNumber: e.target.value })}
                                required
                                style={{ marginLeft: "8px" }}
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                    </div>
                    <button type="submit" style={{ marginRight: "8px" }}>Add Worker</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            ) : (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "24px" }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Birthday</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Address</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Phone Number</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedWorkers.map((worker) => (
                                <tr key={worker.id}>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.id}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.name}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.birthday}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.address}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.phoneNumber}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.dateCreated ?? "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            style={{ marginRight: "8px", padding: "6px 12px" }}
                        >
                            Previous
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            style={{ marginLeft: "8px", padding: "6px 12px" }}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Worker;