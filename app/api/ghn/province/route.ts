import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function GET() {
  try {
    const token = process.env.GHN_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Missing GHN token" },
        { status: 500 }
      );
    }

    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        headers: {
          Token: token,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    const err = error as AxiosError;

    console.error(
      "GHN province error:",
      err.response?.data || err.message
    );

    return NextResponse.json(
      {
        error: "GHN province failed",
        detail: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
