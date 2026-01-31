import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = process.env.GHN_TOKEN;
    const shopId = process.env.GHN_SHOP_ID;

    if (!token || !shopId) {
      return NextResponse.json(
        { error: "Missing GHN credentials" },
        { status: 500 }
      );
    }

    const res = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      body,
      {
        headers: {
          Token: token,
          ShopId: shopId,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      fee: res.data?.data?.total ?? 0,
      raw: res.data,
    });
  } catch (error) {
    const err = error as AxiosError;

    console.error("GHN API error:", err.response?.data || err.message);

    return NextResponse.json(
      {
        error: "GHN API failed",
        detail: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
