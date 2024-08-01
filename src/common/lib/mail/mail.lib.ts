import { env } from '@env';
import { Service } from 'typedi';
import { SmtpProvider } from './smtp.provider';
import { MailInterface } from '@interfaces/mail.interface';

@Service()
export class MailService implements MailInterface {
  private provider: any;

  public constructor() {
    this.setProvider(env.email.provider);
  }

  public setProvider(provider: string) {
    switch (provider) {
      case 'smtp':
        this.provider = new SmtpProvider();
        break;

      default:
        break;
    }

    return this;
  }

  public from(value: string): this {
    return this.provider.from(value);
  }

  public to(value: string): this {
    return this.provider.to(value);
  }

  public subject(value: string): this {
    return this.provider.subject(value);
  }

  public text(value: string): this {
    return this.provider.text(value);
  }

  public html(value: string): this {
    return this.provider.html(value);
  }

  public async send(): Promise<any> {
    return await this.provider.send();
  }
}
