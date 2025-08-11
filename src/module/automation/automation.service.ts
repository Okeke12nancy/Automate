import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as puppeteer from 'puppeteer';
import { User } from '../user/entities/user.entity';
import { CardLog } from './entities/card-log.entity';
import { CardAutomationInput } from './dto/card-automation.input';
import { AutomationResponse } from './dto/automation.response';

// @Injectable()
// export class AutomationService {
//   private readonly logger = new Logger(AutomationService.name);

//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(CardLog)
//     private cardLogRepository: Repository<CardLog>,
//   ) {}

//   async addCardToParamount(input: CardAutomationInput): Promise<AutomationResponse> {
//     let browser;
//     let page;
    
//     try {
//       const user = await this.userRepository.findOne({ where: { id: input.userId } });
//       if (!user) {
//         throw new NotFoundException('User not found');
//       }

//       if (!user.paramountEmail || !user.paramountPassword) {
//         throw new Error('User does not have Paramount+ credentials');
//       }

//       this.logger.log(`Starting card automation for user: ${user.email}`);

//       browser = await puppeteer.launch({
//         headless: false,
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//       });

//       page = await browser.newPage();
//       await page.setViewport({ width: 1366, height: 768 });

//       // Navigate to Paramount+
//       await this.retryAction(async () => {
//         await page.goto('https://www.paramountplus.com/account/signin/', { waitUntil: 'networkidle2' });
//       }, 'SIGN IN');


//       await this.retryAction(async () => {
//         await page.waitForSelector('input[type="email"]', { timeout: 50000 });
//         await page.type('input[type="email"]', user.paramountEmail);
//         await page.type('input[type="password"]', user.paramountPassword);
      
//       await page.click('button.qt-continuebtn');

// // Had to add an error handler to get the error message
//       try {
//         const errorSelector = 'p.form-message.error';
//         await page.waitForSelector(errorSelector, { timeout: 50000 });
//         // If the selector is found, get the text and throw an error
//         const errorElement = await page.$(errorSelector);
//         const errorMessage = await page.evaluate(el => el.textContent.trim(), errorElement);
        
//         throw new Error(`Login failed: ${errorMessage}`);
//     } catch (e) {
      
//         if (e.name !== 'TimeoutError') {
//             throw e;
//         }
//     }
//       }, 'Continue');
   
//       await this.retryAction(async () => {
//         await page.waitForNavigation({ waitUntil: 'networkidle2' });
//       }, 'Wait for login completion');

//       await this.retryAction(async () => {
//         await page.goto('https://www.paramountplus.com/account', { waitUntil: 'networkidle2' });
//       }, 'Navigate to account settings');

//       await this.retryAction(async () => {
//         await page.waitForSelector('a[href*="billing"], a[href*="payment"], button:contains("Payment")', { timeout: 10000 });
//         await page.click('a[href*="billing"], a[href*="payment"], button:contains("Payment")');
//       }, 'Navigate to payment section');

//       await this.retryAction(async () => {
//         await page.waitForSelector('input[name*="card"], input[placeholder*="card"]', { timeout: 10000 });
//         await page.type('input[name*="card"], input[placeholder*="card"]', input.cardNumber);
//         await page.type('input[name*="expiry"], input[placeholder*="MM"]', input.expiryMonth);
//         await page.type('input[name*="expiry"], input[placeholder*="YY"]', input.expiryYear);
//         await page.type('input[name*="cvv"], input[placeholder*="CVV"]', input.cvv);
        
//         if (input.cardholderName) {
//           await page.type('input[name*="name"], input[placeholder*="name"]', input.cardholderName);
//         }
        
//         await page.click('button[type="submit"], button:contains("Save"), button:contains("Add")');
//       }, 'Fill card details');

//       // Wait for success
//       await this.retryAction(async () => {
//         await page.waitForSelector('.success, .alert-success, [data-testid="success"]', { timeout: 15000 });
//       }, 'Wait for success confirmation');

//       // Log success
//       await this.logCardOperation(input.userId, 'ADD_CARD', 'SUCCESS', undefined, input.cardNumber.slice(-4));

//       this.logger.log(`Card automation completed successfully for user: ${user.email}`);

//       return {
//         success: true,
//         message: 'Card added successfully to Paramount+',
//       };

//     } catch (error) {
//       this.logger.error(`Card automation failed: ${error.message}`, error.stack);
      
//       await this.logCardOperation(
//         input.userId,
//         'ADD_CARD',
//         'FAILED',
//         error.message,
//         input.cardNumber.slice(-4)
//       );

//       return {
//         success: false,
//         errorMessage: error.message,
//       };
//     } finally {
//       if (page) await page.close();
//       if (browser) await browser.close();
//     }
//   }

//   private async retryAction(action: () => Promise<void>, actionName: string, maxRetries = 3): Promise<void> {
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         await action();
//         return;
//       } catch (error) {
//         this.logger.warn(`Attempt ${attempt} failed for ${actionName}: ${error.message}`);
        
//         if (attempt === maxRetries) {
//           throw new Error(`${actionName} failed after ${maxRetries} attempts: ${error.message}`);
//         }
        
//         await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
//       }
//     }
//   }

//   private async logCardOperation(
//     userId: string,
//     action: string,
//     status: string,
//     errorMessage?: string,
//     cardLastFour?: string,
//   ): Promise<void> {
//     const cardLog = this.cardLogRepository.create({
//       userId,
//       action,
//       status,
//       errorMessage,
//       cardLastFour,
//       cardType: this.detectCardType(cardLastFour),
//     });

//     await this.cardLogRepository.save(cardLog);
//   }

//   private detectCardType(cardNumber?: string): string {
//     if (!cardNumber) return 'Unknown';
    
//     const patterns = {
//       visa: /^4/,
//       mastercard: /^5[1-5]/,
//       amex: /^3[47]/,
//       discover: /^6(?:011|5)/,
//     };

//     for (const [type, pattern] of Object.entries(patterns)) {
//       if (pattern.test(cardNumber)) {
//         return type.toUpperCase();
//       }
//     }

//     return 'Unknown';
//   }

//   async getCardLogs(userId: string): Promise<CardLog[]> {
//     return this.cardLogRepository.find({
//       where: { userId },
//       order: { createdAt: 'DESC' },
//     });
//   }
// }

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CardLog)
    private cardLogRepository: Repository<CardLog>,
  ) {}

  async addCardToParamount(
    input: CardAutomationInput,
  ): Promise<AutomationResponse> {
    let browser;
    let page;

    try {
      const user = await this.userRepository.findOne({
        where: { id: input.userId },
      });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      if (!user.paramountEmail || !user.paramountPassword) {
        throw new Error("User does not have Paramount+ credentials");
      }

      this.logger.log(`Starting card automation for user: ${user.email}`);

      browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });

      // here we choose to navigate to Paramount+ sign-in page directly because we know the URL
      await this.retryAction(async () => {
        await page.goto("https://www.paramountplus.com/account/signin/", {
          waitUntil: "networkidle2",
        });
      }, "SIGN IN");

      await this.retryAction(async () => {
        await page.waitForSelector('input[type="email"]', { timeout: 50000 });
        await page.type('input[type="email"]', user.paramountEmail);
        await page.type('input[type="password"]', user.paramountPassword);

        await page.click("button.qt-continuebtn");

        // at signup, if vpn is not on, or location is not US, we hit some errors, we listen to that error
        // and rethrow it,
        //
        // we could otherwise, display a structured format of this error in our API layer (the graphQL response as an ErrorResponse)
        try {
          const errorSelector = "p.form-message.error";
          await page.waitForSelector(errorSelector, { timeout: 50000 });
          const errorElement = await page.$(errorSelector);
          const errorMessage = await page.evaluate(
            (el) => el.textContent.trim(),
            errorElement,
          );

          throw new Error(`Login failed: ${errorMessage}`);
        } catch (e) {
          if (e.name !== "TimeoutError") {
            throw e;
          }
        }
      }, "Login");

      // upon login, we're redirected to a paywalled page, and attempt to select a payment plan from the payment options plans
      await this.retryAction(async () => {
        await page.waitForNavigation({ waitUntil: "networkidle2" });
      }, "Wait for login and redirect to plan selection");

      //  as a decision, we select the cheaper payment option plan, our users' can decide to upgrade in future
      await this.retryAction(async () => {
        await page.waitForSelector("button.qt-continuebtn:nth-of-type(2)", {
          timeout: 10000,
        });
        await page.click("button.qt-continuebtn:nth-of-type(2)");
      }, "Select the cheaper plan option");

      await this.retryAction(async () => {
        await page.waitForNavigation({ waitUntil: "networkidle2" });
      }, "Wait for redirect to payment page");

      // finally, we would fill in the user's payment credentials, submit and log thi payment entry
      await this.retryAction(async () => {
        // since these are not regular HTML elements, we can't work with the DOM directly, they are hosted fields
        // therefore, we hve to :
        //
        // To interact with these fields, you need to:
        //
        // Find the <iframe> element for each hosted field.
        //
        // Get the frame object for that <iframe> from Puppeteer.
        //
        // Use the frame object to find and type into the fields inside the iframe.

        // Find the iframe for the credit card number
        // const cardNumberFrame = page
        //   .frames()
        //   .find(
        //     (frame) =>
        //       frame.url().includes("api.recurly.com/js/v1/field.html") &&
        //       frame.url().includes("type%22%3A%22number"),
        //   );
        // if (!cardNumberFrame)
        //   throw new Error("Credit card number iframe not found.");
        //
        // // Find the iframe for the expiration month
        // const expiryMonthFrame = page
        //   .frames()
        //   .find(
        //     (frame) =>
        //       frame.url().includes("api.recurly.com/js/v1/field.html") &&
        //       frame.url().includes("type%22%3A%22month"),
        //   );
        // if (!expiryMonthFrame)
        //   throw new Error("Expiration month iframe not found.");
        //
        // // Find the iframe for the expiration year
        // const expiryYearFrame = page
        //   .frames()
        //   .find(
        //     (frame) =>
        //       frame.url().includes("api.recurly.com/js/v1/field.html") &&
        //       frame.url().includes("type%22%3A%22year"),
        //   );
        // if (!expiryYearFrame)
        //   throw new Error("Expiration year iframe not found.");
        //
        // // Find the iframe for the CVV
        // const cvvFrame = page
        //   .frames()
        //   .find(
        //     (frame) =>
        //       frame.url().includes("api.recurly.com/js/v1/field.html") &&
        //       frame.url().includes("type%22%3A%22cvv"),
        //   );
        // if (!cvvFrame) throw new Error("CVV iframe not found.");

        // Use the below approach, much cleaner
        // we wait for all hoisted fields to be present
        const [cardNumberFrame, expiryMonthFrame, expiryYearFrame, cvvFrame] =
          await Promise.all([
            page
              .waitForSelector("#cc-number iframe")
              .then((handle) => handle.contentFrame()),
            page
              .waitForSelector("#cc-expire-month iframe")
              .then((handle) => handle.contentFrame()),
            page
              .waitForSelector("#cc-expire-year iframe")
              .then((handle) => handle.contentFrame()),
            page
              .waitForSelector("#cc-cvv iframe")
              .then((handle) => handle.contentFrame()),
          ]);

        if (
          !cardNumberFrame ||
          !expiryMonthFrame ||
          !expiryYearFrame ||
          !cvvFrame
        ) {
          throw new Error("One or more payment iframes were not found.");
        }

        await cardNumberFrame.type("input", input.cardNumber);
        await expiryMonthFrame.type("input", input.expiryMonth);
        await expiryYearFrame.type("input", input.expiryYear);
        await cvvFrame.type("input", input.cvv);

        // for standard DOM elements, we simply pass in their values
        // pass in the first and last name fields
        if (input.cardholderName) {
          const names = input.cardholderName.split(" ");
          if (names.length > 0) {
            await page.type('input[data-ci="first_name"]', names[0]);
          }
          if (names.length > 1) {
            await page.type(
              'input[data-ci="last_name"]',
              names.slice(1).join(" "),
            );
          }
        }

        if (input.address) {
          await page.type('input[data-ci="address1"]', input.address);
        }
        if (input.city) {
          await page.type('input[data-ci="city"]', input.city);
        }
        if (input.state) {
          await page.select('select[data-recurly="state"]', input.state);
        }
        if (input.zipCode) {
          await page.type('input[data-ci="postal_code"]', input.zipCode);
        }

        // finally we click on the Submit button to complete our payment intiation operation
        const submitButtonSelector = "button.button.primary";
        await page.waitForSelector(submitButtonSelector, { timeout: 10000 });
        await page.click(submitButtonSelector);
      }, "Fill card details");

      // NOTE: we are not sure, this would redirect here, so no point in having this!
      // await this.retryAction(async () => {
      //   await page.waitForSelector(
      //     '.success, .alert-success, [data-testid="success"]',
      //     { timeout: 15000 },
      //   );
      // }, "Wait for success confirmation");

      // To round up, we log the operation within our system, and return an API response to through our graphQL server
      await this.logCardOperation(
        input.userId,
        "ADD_CARD",
        "SUCCESS",
        undefined,
        input.cardNumber.slice(-4),
      );

      this.logger.log(
        `Card automation completed successfully for user: ${user.email}`,
      );

      return {
        success: true,
        message: "Card added successfully to Paramount+",
      };
    } catch (error) {
      // at this point, we can assume our operation is failing, we:
      // log the error for tracing, and debugging
      //
      // and return a structured response back to our user
      this.logger.error(
        `Card automation failed: ${error.message}`,
        error.stack,
      );

      await this.logCardOperation(
        input.userId,
        "ADD_CARD",
        "FAILED",
        error.message,
        input.cardNumber.slice(-4),
      );

      return {
        success: false,
        errorMessage: error.message,
      };
    } finally {
      if (page) await page.close();
      if (browser) await browser.close();
    }
  }

  private async retryAction(action: () => Promise<void>, actionName: string, maxRetries = 3): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await action();
        return;
      } catch (error) {
        this.logger.warn(`Attempt ${attempt} failed for ${actionName}: ${error.message}`);
        
        if (attempt === maxRetries) {
          throw new Error(`${actionName} failed after ${maxRetries} attempts: ${error.message}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }

  private async logCardOperation(
    userId: string,
    action: string,
    status: string,
    errorMessage?: string,
    cardLastFour?: string,
  ): Promise<void> {
    const cardLog = this.cardLogRepository.create({
      userId,
      action,
      status,
      errorMessage,
      cardLastFour,
      cardType: this.detectCardType(cardLastFour),
    });

    await this.cardLogRepository.save(cardLog);
  }

  private detectCardType(cardNumber?: string): string {
    if (!cardNumber) return 'Unknown';
    
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(cardNumber)) {
        return type.toUpperCase();
      }
    }

    return 'Unknown';
  }

  async getCardLogs(userId: string): Promise<CardLog[]> {
    return this.cardLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}