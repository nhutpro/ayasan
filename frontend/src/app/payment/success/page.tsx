import Link from "next/link";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-4 mb-6">
                    <svg
                        className="w-16 h-16 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Thank you for your payment. Your transaction has been completed successfully.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
}