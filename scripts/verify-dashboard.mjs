import assert from "node:assert/strict";
import { chromium } from "playwright";

// Isolated browser fixtures: no real account, credentials, or database writes.
const baseURL = process.env.DASHBOARD_TEST_URL || "http://localhost:3002";
const supabaseURL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
if (!supabaseURL)
  throw new Error("Load .env.local before running this verification.");
const id = "00000000-0000-4000-8000-000000000001";
const user = {
  id,
  email: "preview@example.test",
  aud: "authenticated",
  role: "authenticated",
  user_metadata: { full_name: "Hanifullah Syukri" },
};
const expiry = Math.floor(Date.now() / 1000) + 3600;
const token = `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, exp: expiry, role: "authenticated" })).toString("base64url")}.fixture`;
const posts = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  title: `Catatan belajar ${index + 1}`,
  slug: `catatan-${index + 1}`,
  topic: index % 2 ? "Refleksi" : "Tadabbur",
  excerpt: "Catatan pengujian untuk membaca dan menulis dengan tenang.",
  status: index % 2 ? "draft" : "published",
  updated_at: "2026-10-15T06:00:00Z",
  created_at: "2026-10-15T06:00:00Z",
  content: [
    { type: "h2", children: [{ text: "Menjaga kebiasaan belajar" }] },
    {
      type: "p",
      children: [
        { text: "Isi artikel untuk memeriksa preview di ponsel. ".repeat(30) },
      ],
    },
    {
      type: "p",
      children: [{ text: "https://example.test/" + "panjang".repeat(70) }],
    },
  ],
  tags: [],
  main_image_url: null,
}));
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
});
const errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.addInitScript(
    ({ key, session }) => {
      localStorage.setItem(key, JSON.stringify(session));
      sessionStorage.setItem(
        "hs-editor-draft",
        JSON.stringify({
          title: "Draft lokal pengujian",
          body: "<p>Isi draft lokal.</p>",
        }),
      );
    },
    {
      key: `sb-${new URL(supabaseURL).hostname.split(".")[0]}-auth-token`,
      session: {
        access_token: token,
        refresh_token: "fixture",
        expires_at: expiry,
        expires_in: 3600,
        token_type: "bearer",
        user,
      },
    },
  );
  let mode = "success";
  await context.route(`${supabaseURL}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes("/rest/v1/posts")) {
      assert.equal(route.request().method(), "GET");
      assert.equal(url.searchParams.get("author_id"), `eq.${id}`);
      return route.fulfill({
        status: mode === "error" ? 503 : 200,
        contentType: "application/json",
        body: JSON.stringify(
          mode === "error"
            ? { message: "Fixture failure" }
            : mode === "empty"
              ? []
              : posts,
        ),
      });
    }
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(user),
    });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseURL}/admin`);
  await page.getByRole("heading", { name: "Beranda", exact: true }).waitFor();
  await page.getByRole("button", { name: "Lihat semua" }).click();
  await page.getByText("12 artikel", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Halaman berikutnya" }).click();
  assert.match(await page.locator(".hs-pagination").innerText(), /11–12/);
  await page.getByRole("searchbox").fill("Catatan belajar 7");
  assert.equal(await page.locator("tbody tr").count(), 1);
  await page.getByRole("searchbox").fill("");
  await page
    .getByRole("navigation", { name: "Filter status artikel" })
    .getByRole("button", { name: "Draft", exact: true })
    .click();
  assert.equal(await page.locator("tbody tr").count(), 6);
  await page.getByRole("combobox").selectOption("Tadabbur");
  await page
    .getByRole("heading", { name: "Tidak ada artikel yang cocok" })
    .waitFor();
  await page.getByRole("button", { name: "Hapus filter" }).click();
  await page.screenshot({
    path: ".next/dashboard-desktop.png",
    fullPage: true,
  });
  for (const width of [360, 390, 768]) {
    console.log(`Checking mobile ${width}px`);
    await page.setViewportSize({ width, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Dashboard overflows at ${width}px`,
    );
    await page.locator(".hs-title-link").first().click();
    await page.locator(".hs-preview[open]").waitFor();
    assert.equal(
      await page
        .locator(".hs-preview")
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
      true,
      `Preview overflows at ${width}px`,
    );
    if (width === 390)
      await page.screenshot({
        path: ".next/dashboard-preview-mobile.png",
      });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Buka menu akun" }).click();
    await page
      .getByRole("navigation", { name: "Menu akun" })
      .getByRole("button", { name: "Pengaturan akun" })
      .click();
    await page.getByRole("heading", { name: "Pengaturan akun" }).waitFor();
    await page
      .getByRole("navigation", { name: "Navigasi utama mobile" })
      .getByRole("button", { name: "Artikel", exact: true })
      .click();
  }
  await page.screenshot({
    path: ".next/dashboard-mobile.png",
    fullPage: true,
  });
  await page.getByRole("link", { name: "Lanjutkan menulis" }).click();
  await page.getByRole("textbox", { name: "Isi artikel", exact: true }).waitFor();
  assert.match(
    await page.getByRole("textbox", { name: "Judul artikel", exact: true }).inputValue(),
    /Draft lokal pengujian/,
  );
  mode = "empty";
  await page.goto(`${baseURL}/admin`);
  await page
    .getByRole("heading", { name: "Tulisan pertama dimulai di sini" })
    .waitFor();
  mode = "error";
  await page.reload();
  await page
    .getByRole("heading", { name: "Daftar artikel belum tersedia" })
    .waitFor();
  await context.close();
  const guest = await browser.newPage();
  await guest.goto(`${baseURL}/admin`, { waitUntil: "domcontentloaded" });
  await guest.waitForURL("**/login", { waitUntil: "domcontentloaded" });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: data, search, status/topic filters, pagination, mobile navigation, preview overflow, local draft, empty/error states, and guest redirect.",
  );
} finally {
  await browser.close();
}
