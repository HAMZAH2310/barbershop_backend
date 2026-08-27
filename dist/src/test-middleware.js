import { isAdmin } from "./middleware/authorization.middleware";
function mockResponse() {
    const res = {};
    res.status = (code) => {
        console.log(`Status: ${code}`);
        return res;
    };
    res.json = (data) => {
        console.log("Response body:", data);
        return res;
    };
    return res;
}
function mockNext() {
    return () => console.log("✅ next() dipanggil — lolos middleware");
}
// Test 1: tidak ada req.user (belum login)
console.log("\n--- Test 1: Tanpa req.user ---");
isAdmin({ user: undefined }, mockResponse(), mockNext());
// Test 2: role bukan ADMIN
console.log("\n--- Test 2: Role USER ---");
isAdmin({ user: { id: "1", role: "USER" } }, mockResponse(), mockNext());
// Test 3: role ADMIN (harus lolos)
console.log("\n--- Test 3: Role ADMIN ---");
isAdmin({ user: { id: "1", role: "ADMIN" } }, mockResponse(), mockNext());
