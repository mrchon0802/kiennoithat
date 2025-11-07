import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const province_id = searchParams.get("province_id");

  if (!province_id)
    return NextResponse.json({ error: "Missing province_id" }, { status: 400 });

  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        headers: {
          Token: process.env.GHN_TOKEN,
        },
        params: { province_id },
      }
    );

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("GHN district error:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: "GHN district failed", detail: err?.response?.data },
      { status: 500 }
    );
  }
}
