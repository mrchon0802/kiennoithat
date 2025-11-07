import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const district_id = searchParams.get("district_id");

  if (!district_id)
    return NextResponse.json({ error: "Missing district_id" }, { status: 400 });

  try {
    const res = await axios.get(
      "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      {
        headers: {
          Token: process.env.GHN_TOKEN,
        },
        params: { district_id },
      }
    );

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("GHN ward error:", err?.response?.data || err.message);
    return NextResponse.json(
      { error: "GHN ward failed", detail: err?.response?.data },
      { status: 500 }
    );
  }
}
