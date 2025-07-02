import {Page, expect} from "@playwright/test";
import uiConfig from '../resources/dev/uiConfig.json';
import { createWorker } from "tesseract.js";

export class OCRTestPage {
    readonly page: Page;
    
    // locators
    ocrPageTitle = () => this.page.locator("//h1[contains(text(),'Accurate Real-time Receipt OCR')]");
    ocrImage = () => this.page.locator("//img[@src='/ocr/api/img/blog/rcpt/AU-1.jpg']");
    //ocrImageText = () => this.page.locator("//div[@class='ocr-text']");

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto(uiConfig.accurateURL); 
    }
    
    async isOCRPageDisplays() {
        await expect(this.ocrPageTitle()).toBeVisible();
    }
    
    async isOCRImageDisplays() {
        await expect(this.ocrImage()).toBeVisible();
    }

    async takeReceiptScreenshot() {
        const receipt = this.ocrImage();
        await receipt.waitFor({ state: 'visible' });
        
        // Ensure directory exists
        await this.page.context().addInitScript(() => {
            window.require('fs').mkdirSync('screenshots', { recursive: true });
        });
        
        // Take screenshot with better options
        return await receipt.screenshot({ 
            path: "screenshots/receipt.jpg",
            type: 'jpeg',
            quality: 90, // for png this is compression level
            timeout: 10000
        });
    }

    async extractAndValidateText(expectedText: string, options = { timeout: 30000 }) {
        const screenshotPath = "screenshots/receipt.jpg";
        const worker = await createWorker();
        
        try {
            
            await worker.reinitialize('eng');
            
            // Configure worker for better receipt recognition
            await worker.setParameters({
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,$- ',
                preserve_interword_spaces: '1'
            });
            
            const { data: { text } } = await worker.recognize(screenshotPath, { 
                rectangle: { top: 0, left: 0, width: 500, height: 500 } 
            });
            
            console.log('Full extracted text:', text); 
            
            // Normalize text for comparison
            const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
            const normalizedExpected = expectedText.toLowerCase();
            
            await expect(normalizedText).toContain(normalizedExpected);
        } finally {
            await worker.terminate();
        }
    }
}