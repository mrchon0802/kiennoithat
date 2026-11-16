import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province_id = searchParams.get("province_id");

  if (!province_id) {
    return NextResponse.json(
      { error: "Missing province_id" },
      { status: 400 }
    );
  }

  try {
    const token = process.env.GHN_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "Missing GHN token" },
        { status: 500 }
      );
    }

    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        headers: {
          Token: token,
        },
        params: {
          province_id: Number(province_id), // GHN cần number
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    const err = error as AxiosError;

    console.error(
      "GHN district error:",
      err.response?.data || err.message
    );

    return NextResponse.json(
      {
        error: "GHN district failed",
        detail: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
