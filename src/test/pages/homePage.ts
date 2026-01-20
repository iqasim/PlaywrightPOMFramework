import { Page, expect } from "@playwright/test";    

export class HomePage {
  readonly page: Page;

  welcomeMessage = () => this.page.locator("//b[contains(text(),'Welcome')]");
  errorMessage = () => this.page.locator("//h1[contains(text(),'Error')]");

  constructor(page: Page) {
    this.page = page;
  }

  async isWelcomMessageDisplays() {
    expect(await this.welcomeMessage().isVisible());
  }

   async welcomMessageShouldNotDisplay() {
    expect(await this.welcomeMessage().count()).toEqual(0);
  }

    async errorMessageDisplays(){
      expect(await this.errorMessage().isVisible());
    }



}
