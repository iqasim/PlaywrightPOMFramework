import { Page, expect } from "@playwright/test";
import { fixtures as test } from "../../fixtures/ui-fixtures";
import uiConfig from '../../resources/dev/uiConfig.json';


test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("Verify Login Page is displayed", async ({ loginPage }) => {
    await loginPage.isLoginPageDisplays();
  });

  
  test("Verify user can log in with valid credentials", async ({ page, loginPage, homepage }) => {
    await page.context().tracing.start({ name: "Login Test Tracing", screenshots: true, snapshots: true });
    await loginPage.login(uiConfig.username, uiConfig.password);;
    await homepage.isWelcomMessageDisplays();
    await page.context().tracing.stop({ path: "traces/login-test-trace.zip" });
    await page.screenshot({ path: "screenshots/login-success.png" });
  });

  test("Verify user cannot log in with invalid credentials", async ({ loginPage, homepage }) => {
    await loginPage.login(uiConfig.invalidUsername, uiConfig.invalidPassword);
    await homepage.welcomMessageShouldNotDisplay(); 
  });
});