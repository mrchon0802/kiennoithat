import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      {
        headers: {
          Token: process.env.GHN_TOKEN,
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("GHN province error:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: "GHN province failed", detail: err?.response?.data },
      { status: 500 }
    );
  }
}
