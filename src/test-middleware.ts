import { isAdmin, type Authroziation } from "./middleware/authorization.middleware";
import { Response } from "express";

function mockResponse() {
    const res: Partial<Response> = {};
    res.status = (code: number) => {
        console.log(`Status: ${code}`);
        return res as Response;
    };
    res.json = (data: any) => {
        console.log("Response body:", data);
        return res as Response;
    };
    return res as Response;
}

function mockNext() {
    return () => console.log("✅ next() dipanggil — lolos middleware");
}

// Test 1: tidak ada req.user (belum login)
console.log("\n--- Test 1: Tanpa req.user ---");
isAdmin({ user: undefined } as Authroziation, mockResponse(), mockNext());

// Test 2: role bukan ADMIN
console.log("\n--- Test 2: Role USER ---");
isAdmin({ user: { id: "1", role: "USER" } } as Authroziation, mockResponse(), mockNext());

// Test 3: role ADMIN (harus lolos)
console.log("\n--- Test 3: Role ADMIN ---");
isAdmin({ user: { id: "1", role: "ADMIN" } } as Authroziation, mockResponse(), mockNext());