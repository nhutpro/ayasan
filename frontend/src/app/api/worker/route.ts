import axios, { AxiosError, HttpStatusCode } from 'axios';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        const response = await axios.get(`${process.env.BACKEND_URL}/worker`, {
            headers: {
                "Authorization": req.headers.get("authorization")
            },
            params: params,
        });
        return NextResponse.json(
            {
                data: response.data,
            },
            { status: HttpStatusCode.Ok },
        )
    } catch (error) {
        const status = (error as AxiosError).response?.status || 500;
        if (status === 401) {
            return NextResponse.json(
                {
                    message: 'Unauthorized access. Please log in again.',
                },
                { status: HttpStatusCode.Unauthorized },
            )
        } else {
            return NextResponse.json({ message: 'Internal Server Error' }, { status: HttpStatusCode.InternalServerError });
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Request body:", body);
        const response = await axios.post(`${process.env.BACKEND_URL}/worker`, body, {
            headers: {
                "Authorization": req.headers.get("authorization")
            }
        });
        return NextResponse.json(
            {
                data: response.data,
            },
            { status: HttpStatusCode.Created },
        )
    } catch (error) {
        const status = (error as AxiosError).response?.status || 500;

        if (status === 401) {
            return NextResponse.json(
                {
                    message: 'Unauthorized access. Please log in again.',
                },
                { status: HttpStatusCode.Unauthorized },
            )
        } else {
            return NextResponse.json({ message: 'Internal Server Error' }, { status: HttpStatusCode.InternalServerError });
        }
    }
}