import { fixtures as test } from "../../fixtures/ui-fixtures";

test.describe('OCR Tests', () => {
    test("Extract text from a payment receipt image from the web", async ({ accurateOCRPage }) => {
        // Step 1: Navigate to page
        await accurateOCRPage.goto(); 
        await accurateOCRPage.isOCRPageDisplays();
        
        // Step 2: Verify image is visible
        await accurateOCRPage.isOCRImageDisplays();
        
        // Step 3: Take screenshot
        await accurateOCRPage.takeReceiptScreenshot();
        
        // Step 4: Extract and validate text with retries
        await test.step('Validate extracted text', async () => {
            const expectedStrings = ['coles express', 'total', 'payment']; // Multiple possible matches
            let found = false;
            let lastError;
            
            // Retry logic for flaky OCR
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    await accurateOCRPage.extractAndValidateText(expectedStrings[0]);
                    found = true;
                    break;
                } catch (error) {
                    lastError = error;
                    // Take new screenshot if retrying
                    if (attempt < 2) await accurateOCRPage.takeReceiptScreenshot();
                }
            }
            
            if (!found) throw lastError;
        });
    });
});