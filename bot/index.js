/**
 * Бот ВКонтакте для мини-приложения «Годовой отчёт НКО» (Вариант Б).
 *
 * Что умеет:
 *  - по словам «отчёт / report» присылает кнопку-ссылку на мини-приложение;
 *  - принимает присланные PDF-документы и подтверждает получение;
 *  - подсказывает, как опубликовать отчёт на стене сообщества.
 *
 * Запуск: cp .env.example .env -> заполнить -> npm install -> npm start
 */
import "dotenv/config";
import { VK, Keyboard } from "vk-io";

const vk = new VK({ token: process.env.VK_TOKEN });
const MINI_APP_URL = process.env.VK_MINI_APP_URL || "https://vk.com/app0000000";

const reportKeyboard = Keyboard.keyboard([
  [Keyboard.urlButton({ label: "Открыть конструктор отчёта", url: MINI_APP_URL })],
  [Keyboard.textButton({ label: "Как это работает", payload: { cmd: "help" } })],
]).inline();

const HELP_TEXT = [
  "Как собрать годовой отчёт прямо в ВКонтакте:",
  "",
  "1. Нажмите «Открыть конструктор отчёта» — мини-приложение откроется внутри ВК.",
  "2. Заполните разделы: организация, показатели, финансы, программы, команда, фотографии.",
  "3. На шаге «Отчёт и PDF» скачайте готовый PDF.",
  "4. Пришлите PDF мне в сообщения — я подтвержу получение и подскажу, как опубликовать его на стене сообщества.",
].join("\n");

vk.updates.on("message", async (ctx) => {
  // Бот общается только в личных сообщениях сообщества
  if (ctx.isChat) return;

  // 1. Пользователь прислал PDF-документ
  if (ctx.hasAttachments("doc")) {
    const doc = ctx.getAttachments("doc")[0];
    const title = doc.title || "документ";
    if (/\.pdf$/i.test(title)) {
      await ctx.reply(
        `PDF «${title}» получен, спасибо! ` +
          "Чтобы опубликовать отчёт на стене сообщества: создайте новый пост, " +
          "прикрепите к нему этот файл и коротко расскажите об итогах года. " +
          "Ссылка на конструктор — в кнопке ниже.",
        { keyboard: reportKeyboard },
      );
    } else {
      await ctx.reply("Я принимаю отчёты в формате PDF. Скачайте PDF в мини-приложении и пришлите его мне.");
    }
    return;
  }

  const text = (ctx.text || "").toLowerCase().trim();

  // 2. Запрос отчёта
  if (/(отч[её]т|годовой|report)/.test(text)) {
    await ctx.reply(
      "Отлично! Годовой отчёт собирается прямо внутри ВКонтакте: откройте конструктор, " +
        "заполните шесть коротких разделов и скачайте свёрстанный PDF.",
      { keyboard: reportKeyboard },
    );
    return;
  }

  // 3. Помощь
  if (/^(старт|начать|\/start|помощь|help|как)/.test(text) || ctx.payload?.cmd === "help") {
    await ctx.reply(HELP_TEXT, { keyboard: reportKeyboard });
    return;
  }

  // 4. Всё остальное
  await ctx.reply(
    "Здравствуйте! Я помогаю НКО готовить публичные годовые отчёты. " +
      "Напишите «отчёт» — и я пришлю ссылку на конструктор.",
    { keyboard: reportKeyboard },
  );
});

vk.updates
  .start()
  .then(() => console.log("Бот запущен. Мини-приложение:", MINI_APP_URL))
  .catch(console.error);
