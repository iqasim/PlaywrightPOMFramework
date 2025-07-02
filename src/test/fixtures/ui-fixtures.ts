import {test as base} from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { HomePage } from "../pages/homePage";
import { OCRTestPage } from "../pages/accurateOCRPage";


type pages = {
  loginPage: LoginPage;
  homepage: HomePage;
  accurateOCRPage: OCRTestPage;
};

const fixtures = base.extend<pages>({
  loginPage: async ({page}, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homepage: async ({page}, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  accurateOCRPage: async ({page}, use) => {
    const accurateOCRPage = new OCRTestPage(page);
    await use(accurateOCRPage);
  }
});

export {fixtures};