import { Page, expect } from "@playwright/test";
import uiConfig from '../resources/dev/uiConfig.json';

export class LoginPage {
  readonly page: Page;

  loginPageTitle = () => this.page.locator("//img[@title='ParaBank']");
  username = ()=>this.page.locator("//input[@name='username']");
  password = ()=>this.page.locator("//input[@name='password']");
  loginButton = ()=>this.page.locator("//input[@value='Log In']");

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(uiConfig.URL);
  }

    async isLoginPageDisplays() {
        expect(await this.loginPageTitle().isVisible());
    }

  async login(username: string, password: string) {
    await this.username().fill(username);
    await this.password().fill(password);
    await this.loginButton().click();
  }

 


}