import bridge from "@vkontakte/vk-bridge";

export interface VkUser {
  id: number;
  first_name: string;
  last_name: string;
  photo_100?: string;
}

type BridgeAny = {
  send: (method: string, params?: Record<string, unknown>) => Promise<unknown>;
  isEmbedded?: () => boolean;
};

const b = bridge as unknown as BridgeAny;

/** Запущено ли приложение внутри ВКонтакте (мини-приложение сообщества). */
export function isVkEmbedded(): boolean {
  try {
    if (typeof b.isEmbedded === "function") return b.isEmbedded();
    return new URLSearchParams(window.location.search).has("vk_app_id");
  } catch {
    return false;
  }
}

/** Инициализация VK Bridge + профиль пользователя. Вне ВК возвращает null. */
export async function initVk(): Promise<VkUser | null> {
  if (!isVkEmbedded()) return null;
  try {
    await b.send("VKWebAppInit");
    try {
      await b.send("VKWebAppSetViewSettings", {
        status_bar_style: "light",
        action_bar_color: "#07211C",
      });
    } catch {
      /* необязательно */
    }
    const user = (await b.send("VKWebAppGetUserInfo")) as VkUser;
    return user && user.id ? user : null;
  } catch {
    return null;
  }
}

/** Скачивание файла средствами ВКонтакте. false — если метод недоступен. */
export async function vkDownloadFile(url: string, filename: string): Promise<boolean> {
  if (!isVkEmbedded()) return false;
  try {
    await b.send("VKWebAppDownloadFile", { url, filename });
    return true;
  } catch {
    return false;
  }
}

/** Открытие окна создания поста (в сообществе или на стене). */
export async function vkOpenPostBox(message: string): Promise<boolean> {
  if (!isVkEmbedded()) return false;
  try {
    await b.send("VKWebAppOpenWallPostBox", { message });
    return true;
  } catch {
    return false;
  }
}
