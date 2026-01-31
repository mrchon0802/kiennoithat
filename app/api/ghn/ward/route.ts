import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const district_id = searchParams.get("district_id");

  if (!district_id) {
    return NextResponse.json(
      { error: "Missing district_id" },
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
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      {
        headers: {
          Token: token,
        },
        params: {
          district_id: Number(district_id), // GHN thích number hơn string
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    const err = error as AxiosError;

    console.error(
      "GHN ward error:",
      err.response?.data || err.message
    );

    return NextResponse.json(
      {
        error: "GHN ward failed",
        detail: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
