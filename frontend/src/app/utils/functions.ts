import axios, { AxiosRequestConfig, Method } from "axios";
import Cookies from "js-cookie";

export async function refreshAccessToken(backendURL: string, refreshToken: string) {
    const res = await axios.post(`${backendURL}/refresh`, {
        refreshToken,
    });

    if (res.status !== 200) return null;
    return res.data.accessToken;
}

export async function logout() {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
    const refreshToken = Cookies.get("refreshToken");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    if (refreshToken) {
        axios.post(`${backendURL}/logout`, {
            refreshToken,
        }).catch(error => {
            console.log("Logout error:", error);
        });
    }
    window.location.href = "/login"; // Redirect to login page
}

export async function fetchWithAuth(
    endpoint: string,
    options: AxiosRequestConfig = {},
    method: Method = "GET",
    data?: any
) {
    let accessToken = Cookies.get("accessToken");
    let refreshToken = Cookies.get("refreshToken");
    const nextBackendURL = process.env.NEXT_PUBLIC_NEXT_BACKEND_URL || "";
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";


    const config: AxiosRequestConfig = {
        ...options,
        method,
        url: `${nextBackendURL}${endpoint}`,
        headers: {
            ...(options.headers || {}),
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        data,
    };

    try {
        const res = await axios.request(config);
        return res.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401 && refreshToken) {

            const newAccessToken = await refreshAccessToken(backendURL, refreshToken);
            console.log("New access token:", newAccessToken);
            if (newAccessToken) {
                Cookies.set("accessToken", newAccessToken, { secure: true, sameSite: "strict" });

                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };
                const retryRes = await axios.request(config);
                return retryRes.data;
            } else {
                // logout();
                // throw new Error("Refresh token expired or invalid");

            }
        }
        throw new Error("Failed to fetch data");
    }
}

export function formatHHmmToUTC(timeStr: string | undefined): string {
    if (!timeStr) return '';

    const [hour, minute] = timeStr.split(':').map(Number);

    return `1970-01-01T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`;
}

export function formatYYYYMMDDToUTC(dateStr: string | undefined): string {
    if (!dateStr) return '';

    return `${dateStr}T00:00:00.000Z`; // UTC ISO 8601 string
}

