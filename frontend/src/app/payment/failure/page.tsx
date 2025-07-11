import Link from "next/link";

export default function PaymentFailed() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 to-red-300">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
                <div className="bg-red-100 rounded-full p-4 mb-4">
                    <svg
                        className="w-12 h-12 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Unfortunately, your payment could not be processed.<br />
                    Please try again or contact support if the issue persists.
                </p>
                <div className="flex gap-4">
                    <Link
                        href="/payment"
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}