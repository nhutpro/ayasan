'use client';
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface LoginValues {
    email: string;
    password: string;
}

const initialValues: LoginValues = {
    email: '',
    password: '',
};

const validate = (values: LoginValues) => {
    const errors: Partial<LoginValues> = {};
    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    return errors;
};

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                if (payload.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/'); // Redirect to home or another page if not admin
                }
            } catch {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
            }
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={async (values, { setSubmitting }) => {
                        setError(null);
                        try {
                            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, values);
                            const { accessToken, refreshToken } = res.data;
                            Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
                            Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });
                            router.push('/admin');
                        } catch (err: any) {
                            setError(err.response?.data?.error || 'Login failed');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1">
                                    Password
                                </label>
                                <Field
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default LoginPage;