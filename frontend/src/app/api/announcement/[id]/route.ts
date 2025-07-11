import axios, { AxiosError, HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const response = await axios.delete(`${process.env.BACKEND_URL}/announcement/${id}`, {
            headers: {
                "Authorization": req.headers.get("authorization")
            }
        });
        return NextResponse.json(
            { data: response.data },
            { status: HttpStatusCode.Ok }
        );
    } catch (error) {
        const status = (error as AxiosError).response?.status || 500;
        if (status === 401) {
            return NextResponse.json(
                { message: 'Unauthorized access. Please log in again.' },
                { status: HttpStatusCode.Unauthorized }
            );
        } else {
            return NextResponse.json(
                { message: 'Internal Server Error' },
                { status: HttpStatusCode.InternalServerError }
            );
        }
    }
}