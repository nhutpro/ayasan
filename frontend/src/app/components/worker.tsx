import React, { useCallback, useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/functions";
import moment from "moment";
import { ErrorMessage, Field, Form, Formik } from "formik";

type Worker = {
    id: number;
    name: string;
    email: string;
    address: string;
    phone: string;
    birthDate: string;
    createdAt: string;
    updatedAt?: string;
};


const PAGE_SIZE = 20;

const Worker: React.FC = () => {
    const [workerList, setWorkerList] = useState<Worker[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newWorker, setNewWorker] = useState<Omit<Worker, "id" | "createdAt" | "updatedAt">>({
        name: "",
        address: "",
        email: "",
        phone: "",
        birthDate: "",
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false)

    const fetchWorkers = async () => {
        setIsLoading(true);
        const response: any = await fetchWithAuth(`/workers?page=${page}&pageSize=${PAGE_SIZE}`);
        if (!response) {
            throw new Error("Failed to fetch workers");
        }

        setWorkerList(response.data.workers);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
    }

    // useEffect(() => {
    //     fetchWorkers();
    // }, [page]);

    useEffect(() => {
        if (showForm) {

        } else {
            setPage(1);
            fetchWorkers();
        }
    }, [showForm, page])


    const handleAddWorker = (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault();
        // const nextId = workerList.length > 0 ? Math.max(...workerList.map(w => w.id)) + 1 : 1;
        // setWorkerList([
        //     ...workerList,
        //     {
        //         id: nextId,
        //         name: newWorker.name,
        //         address: newWorker.address,
        //         phone: newWorker.phone,
        //         birthDate: newWorker.birthDate,
        //         createdAt: new Date().toLocaleDateString(),
        //     },
        // ]);
        // setNewWorker({ name: "", address: "", phone: "", birthDate: "" });
        // setShowForm(false);
        // setPage(Math.ceil((workerList.length + 1) / PAGE_SIZE)); // Go to last page
    };

    return (
        <div>
            {!showForm && (
                <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
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
                        onClick={() => setShowForm(true)}
                    >
                        <span style={{ marginRight: "8px", fontSize: "18px" }}>＋</span>
                        Create Worker
                    </button>
                </div>)}
            {showForm ? (
                <Formik
                    initialValues={{
                        name: "",
                        address: "",
                        phone: "",
                        email: "",
                        birthDate: "",
                    }}
                    validate={values => {
                        const errors: any = {};
                        if (!values.name) errors.name = "Required";
                        if (!values.address) errors.address = "Required";
                        if (!values.phone) errors.phone = "Required";
                        if (!values.email) {
                            errors.email = "Required";
                        } else if (
                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                        ) {
                            errors.email = "Invalid email address";
                        }
                        if (!values.birthDate) errors.birthDate = "Required";
                        return errors;
                    }}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        // Handle submit logic here (e.g., call API)
                        console.log("Worker values:", values);
                        setSubmitting(false);
                        resetForm();
                        setShowForm(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="max-w-lg mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Create Worker</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                                    Name
                                </label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="address">
                                    Address
                                </label>
                                <Field
                                    type="text"
                                    name="address"
                                    id="address"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="phone">
                                    Phone
                                </label>
                                <Field
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="birthDate">
                                    Birthdate
                                </label>
                                <Field
                                    type="date"
                                    name="birthDate"
                                    id="birthDate"
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <ErrorMessage name="birthDate" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition disabled:opacity-50"
                                >
                                    Add Worker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-md transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

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
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
                                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workerList.map((worker) => (
                                <tr key={worker.id}>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.id}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.name}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{moment(worker.birthDate).format("YYYY-MM-DD")}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.address}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.phone}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{worker.email}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{moment(worker.createdAt).format("YYYY-MM-DD")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <button className="cursor-pointer"
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
                            className="cursor-pointer"
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