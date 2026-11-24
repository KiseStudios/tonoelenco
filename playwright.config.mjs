import { defineConfig, devices } from "@playwright/test";

const port = process.env.ELENCO_QA_PORT ?? "4173";
const baseURL = `http://127.0.0.1:${port}`;
const chromePath = process.env.ELENCO_CHROME_PATH;
const chromiumLaunch = chromePath ? {
  executablePath: chromePath,
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
} : undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }], ["json", { outputFile: "test-results/e2e.json" }]],
  use: { baseURL, trace: "retain-on-failure", video: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: "node tests/e2e/static-server.mjs",
    url: baseURL,
    reuseExistingServer: false,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium", viewport: { width: 1440, height: 900 }, launchOptions: chromiumLaunch } },
    { name: "firefox", use: { browserName: "firefox", viewport: { width: 820, height: 1024 } } },
    { name: "webkit", use: { browserName: "webkit", viewport: { width: 390, height: 844 } } },
    {
      name: "android-emulado",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 }, launchOptions: chromiumLaunch },
    },
  ],
});
