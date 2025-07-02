import { Page, expect } from "@playwright/test";    

export class HomePage {
  readonly page: Page;

  welcomeMessage = () => this.page.locator("//b[contains(text(),'Welcome')]");

  constructor(page: Page) {
    this.page = page;
  }

  async isWelcomMessageDisplays() {
    expect(await this.welcomeMessage().isVisible());
  }

   async welcomMessageShouldNotDisplay() {
    expect(await this.welcomeMessage().count()).toEqual(0);
  }



}