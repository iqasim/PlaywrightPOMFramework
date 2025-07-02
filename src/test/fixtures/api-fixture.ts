import {test as base} from '@playwright/test';
import config from '../../../playwright.config';
import APIClient from '../utils/api-client';

type APIFixtures = {
  authApiFixture: APIClient;
  commonApiFixture: APIClient;
};  

const fixtures = base.extend<APIFixtures>({
  authApiFixture: async ({request}, use) => {
    const API = new APIClient(request, config.authURL);
    await use(API);
  },
  commonApiFixture: async ({request}, use) => {
    const API = new APIClient(request, config.baseURL);
    await use(API);
  }
});     

export {fixtures};