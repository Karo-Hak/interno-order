import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  private readonly bots: Record<string, { token: string; chatIds: string[] }> = {};

  constructor(private readonly configService: ConfigService) {
    this.bots = {
      plint: {
        token: this.configService.get<string>('TG_BOT_TOKEN_PLINT') ?? '',
        chatIds: (this.configService.get<string>('TG_CHAT_ID_PLINT') ?? '').split(',').filter(Boolean),
      },
      wallpaper: {
        token: this.configService.get<string>('TG_BOT_TOKEN_WALLPAPER') ?? '',
        chatIds: (this.configService.get<string>('TG_CHAT_ID_WALLPAPER') ?? '').split(',').filter(Boolean),
      },
      // можно добавить новые разделы
    };
  }

  // Общий метод отправки уведомления
  async sendSectionNotification(section: keyof typeof this.bots, order: any) {
    const bot = this.bots[section];
    if (!bot?.token || bot.chatIds.length === 0) {
      this.logger.error(`❌ Bot for section "${section}" is not configured`);
      return;
    }

    const text = this.buildMessage(section, order);
    const apiBase = `https://api.telegram.org/bot${bot.token}`;

    for (const chatId of bot.chatIds) {
      try {
        await axios.post(`${apiBase}/sendMessage`, {
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
        this.logger.log(`✅ Уведомление отправлено в ${section} → ${chatId}`);
      } catch (err: any) {
        this.logger.error(`[Telegram ${section}] Ошибка отправки в ${chatId}: ${err?.response?.data ?? err.message}`);
      }
    }
  }

  // Разделяем сборку текста по разделам
  private buildMessage(section: string, order: any): string {
    switch (section) {
      case 'plint':
        return this.buildPlintMessage(order);
      case 'wallpaper':
        return this.buildWallpaperMessage(order);
      default:
        return `🛒 Новый заказ в разделе ${section}!\nЗаказ №: ${order.id}`;
    }
  }

  private buildPlintMessage(order: any): string {
    const items = (order.groupedPlintData ?? []).map((i: any) => `${i.name} (${i.quantity})`).join(', ');
    return (
      `🛒 <b>Новый заказ в Plint!</b>\n` +
      `<b>Заказ №:</b> ${order.id}\n` +
      `<b>Позиции:</b> ${items || '—'}\n` +
      `<b>Покупатель:</b> ${order.buyerName ?? '—'}\n` +
      `<b>Сумма:</b> ${order.groundTotal ?? 0}`
    );
  }

  private buildWallpaperMessage(order: any): string {
    // Пример: больше полей, можно кастомно
    const items = (order.groupedWallpaperData ?? []).map((i: any) => `${i.name} (${i.quantity})`).join('\n');
    return (
      `🖼 <b>Новый заказ в Wallpaper!</b>\n` +
      `<b>Заказ №:</b> ${order.id}\n` +
      `<b>Позиции:</b>\n${items || '—'}\n` +
      `<b>Покупатель:</b> ${order.buyerName ?? '—'}\n` +
      `<b>Адрес:</b> ${order.address ?? '—'}\n` +
      `<b>Сумма:</b> ${order.groundTotal ?? 0}`
    );
  }

  async sendMessage(token: string, chatId: string | number, text: string) {
    if (!token || !chatId) {
      this.logger.error(`❌ sendMessage: token или chatId пустые`);
      return;
    }
    const apiBase = `https://api.telegram.org/bot${token}`;
    await axios.post(`${apiBase}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
  }
}
