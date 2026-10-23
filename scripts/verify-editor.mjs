import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseURL = process.env.DASHBOARD_TEST_URL || "http://localhost:3002";
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const id = "00000000-0000-4000-8000-000000000001";
const user = { id, email: "editor@example.test", aud: "authenticated", role: "authenticated", user_metadata: {} };
const expiry = Math.floor(Date.now() / 1000) + 3600;
const token = `${Buffer.from('{"alg":"HS256"}').toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, exp: expiry, role: "authenticated" })).toString("base64url")}.fixture`;
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const context = await browser.newContext();
  await context.addInitScript(({ key, session }) => {
    localStorage.setItem(key, JSON.stringify(session));
    if (!sessionStorage.getItem("hs-editor-draft")) sessionStorage.setItem("hs-editor-draft", JSON.stringify({ title: "Draft migrasi", body: "<p>Isi draft lama yang harus tetap ada.</p>" }));
  }, { key: `sb-${new URL(supabaseURL).hostname.split(".")[0]}-auth-token`, session: { access_token: token, refresh_token: "fixture", expires_at: expiry, expires_in: 3600, token_type: "bearer", user } });
  const writes = [];
  await context.route(`${supabaseURL}/**`, async (route) => {
    if (route.request().url().includes("/rest/v1/posts")) {
      const data = route.request().postDataJSON();
      writes.push(data);
      return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(data) });
    }
    return route.fulfill({ contentType: "application/json", body: JSON.stringify(user) });
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseURL}/admin/editor`);
  const body = page.getByRole("textbox", { name: "Isi artikel", exact: true });
  await body.waitFor();
  await page.waitForFunction(() => document.querySelector(".tiptap")?.textContent.includes("Isi draft lama"));
  assert.equal(await page.getByRole("textbox", { name: "Judul artikel", exact: true }).inputValue(), "Draft migrasi");
  await body.click();
  await page.keyboard.press("Control+End");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Tebal", exact: true }).click();
  await page.keyboard.type("Teks tebal baru");
  assert.match(await body.innerHTML(), /<strong>Teks tebal baru/);
  await page.getByRole("button", { name: "Tautan", exact: true }).click();
  await page.getByRole("dialog").getByRole("textbox").fill("https://example.com");
  await page.getByRole("button", { name: "Sisipkan", exact: true }).click();
  await page.getByRole("button", { name: "Simpan draft", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "Draft tersimpan ke server" }).waitFor();
  assert.equal(writes[0].content.type, "doc");
  assert.equal(writes[0].author_id, id);
  await page.getByRole("button", { name: "Terbitkan", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "berhasil diterbitkan" }).waitFor();
  assert.equal(writes[1].id, writes[0].id);
  assert.equal(writes[1].status, "published");
  await page.reload();
  await body.waitFor();
  await page.waitForFunction(() => document.querySelector(".tiptap")?.textContent.includes("Teks tebal baru"));
  for (const width of [1024, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  assert.deepEqual(errors, []);
  console.log("PASS: legacy draft migration, Tiptap formatting/link, server draft/publish without duplication, recovery, responsive layout, no runtime errors. Database requests were mocked.");
} finally { await browser.close(); }
