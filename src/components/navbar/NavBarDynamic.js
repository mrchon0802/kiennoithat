"use client";

import dynamic from "next/dynamic";

const NavBarDynamic = dynamic(() => import("./NavBar"), { ssr: false });
