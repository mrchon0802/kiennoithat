import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const token = process.env.GHN_TOKEN;
    const shopId = process.env.GHN_SHOP_ID;

    console.log("GHN_TOKEN:", process.env.GHN_TOKEN);
    console.log("GHN_SHOP_ID:", process.env.GHN_SHOP_ID);

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
  } catch (err) {
    console.error("GHN API error:", err);
    return NextResponse.json(
      {
        error: "GHN API failed",
        detail: err?.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
