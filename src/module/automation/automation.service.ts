import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as puppeteer from 'puppeteer';
import { User } from '../user/entities/user.entity';
import { CardLog } from './entities/card-log.entity';
import { CardAutomationInput } from './dto/card-automation.input';
import { AutomationResponse } from './dto/automation.response';

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CardLog)
    private cardLogRepository: Repository<CardLog>,
  ) {}

  async addCardToParamount(input: CardAutomationInput): Promise<AutomationResponse> {
    let browser;
    let page;
    
    try {
      const user = await this.userRepository.findOne({ where: { id: input.userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.paramountEmail || !user.paramountPassword) {
        throw new Error('User does not have Paramount+ credentials');
      }

      this.logger.log(`Starting card automation for user: ${user.email}`);

      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });

      // Navigate to Paramount+
      await this.retryAction(async () => {
        await page.goto('https://www.paramountplus.com', { waitUntil: 'networkidle2' });
      }, 'Navigate to Paramount+');

      // Click Sign In
      await this.retryAction(async () => {
        await page.waitForSelector('a[href*="signin"]', { timeout: 10000 });
        await page.click('a[href*="signin"]');
      }, 'Click Sign In');

      // Wait for login form and fill credentials
      await this.retryAction(async () => {
        await page.waitForSelector('input[type="email"]', { timeout: 10000 });
        await page.type('input[type="email"]', user.paramountEmail);
        await page.type('input[type="password"]', user.paramountPassword);
        await page.click('button[type="submit"]');
      }, 'Fill login credentials');

      // Wait for login to complete
      await this.retryAction(async () => {
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
      }, 'Wait for login completion');

      // Navigate to account settings or billing
      await this.retryAction(async () => {
        await page.goto('https://www.paramountplus.com/account', { waitUntil: 'networkidle2' });
      }, 'Navigate to account settings');

      // Look for payment method section
      await this.retryAction(async () => {
        await page.waitForSelector('a[href*="billing"], a[href*="payment"], button:contains("Payment")', { timeout: 10000 });
        await page.click('a[href*="billing"], a[href*="payment"], button:contains("Payment")');
      }, 'Navigate to payment section');

      // Add new payment method
      await this.retryAction(async () => {
        await page.waitForSelector('input[name*="card"], input[placeholder*="card"]', { timeout: 10000 });
        await page.type('input[name*="card"], input[placeholder*="card"]', input.cardNumber);
        await page.type('input[name*="expiry"], input[placeholder*="MM"]', input.expiryMonth);
        await page.type('input[name*="expiry"], input[placeholder*="YY"]', input.expiryYear);
        await page.type('input[name*="cvv"], input[placeholder*="CVV"]', input.cvv);
        
        if (input.cardholderName) {
          await page.type('input[name*="name"], input[placeholder*="name"]', input.cardholderName);
        }
        
        await page.click('button[type="submit"], button:contains("Save"), button:contains("Add")');
      }, 'Fill card details');

      // Wait for success
      await this.retryAction(async () => {
        await page.waitForSelector('.success, .alert-success, [data-testid="success"]', { timeout: 15000 });
      }, 'Wait for success confirmation');

      // Log success
      await this.logCardOperation(input.userId, 'ADD_CARD', 'SUCCESS', undefined, input.cardNumber.slice(-4));

      this.logger.log(`Card automation completed successfully for user: ${user.email}`);

      return {
        success: true,
        message: 'Card added successfully to Paramount+',
      };

    } catch (error) {
      this.logger.error(`Card automation failed: ${error.message}`, error.stack);
      
      await this.logCardOperation(
        input.userId,
        'ADD_CARD',
        'FAILED',
        error.message,
        input.cardNumber.slice(-4)
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
