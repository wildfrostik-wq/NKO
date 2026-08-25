import type { ReportData } from "../types";
import { uid } from "../lib/format";

export const DEMO_IMAGES = {
  cover:
    "https://image.qwenlm.ai/generated-images/4ab3259e-3470-4dfe-bc7e-cd104dc34e7c/_result.png",
  photo1:
    "https://image.qwenlm.ai/generated-images/ca1cec38-1aa6-4591-a175-c198aa4e9fca/_result.png",
  photo2:
    "https://image.qwenlm.ai/generated-images/aa94d62f-fff3-4c0f-a3e4-fd1d96651a00/_result.png",
  photo3:
    "https://image.qwenlm.ai/generated-images/d1b17dbf-25a8-44d8-bbf7-71418c7df425/_result.png",
  portrait1:
    "https://image.qwenlm.ai/generated-images/f6d6c66b-3bac-4c9c-a9a7-5d21c977d974/_result.png",
  portrait2:
    "https://image.qwenlm.ai/generated-images/59468c65-8f7e-4a84-a38d-7bb75a474abb/_result.png",
};

export function demoData(): ReportData {
  return {
    year: "2025",
    org: {
      name: "Благотворительный фонд «Тёплый Север»",
      shortName: "Фонд «Тёплый Север»",
      inn: "2901298765",
      ogrn: "1152901003355",
      address: "163000, г. Архангельск, наб. Северной Двины, д. 55, оф. 12",
      email: "hello@teplysever.ru",
      phone: "+7 (8182) 46-20-15",
      site: "teplysever.ru",
      bankAccount: "40703810404500012345",
      bankName: "АО «Северный народный банк»",
      bik: "041117601",
      logo: "",
      mission:
        "Мы работаем, чтобы дети и семьи Европейского Севера получали помощь рядом с домом: поддерживаем образование и здоровье детей из удалённых посёлков, развиваем местное добровольчество и адресную социальную поддержку.",
      directorWord:
        "Этот год стал для фонда годом взросления: мы впервые вышли в 14 посёлков, запустили мобильную бригаду помощи и удвоили число стипендиатов. За каждой цифрой этого отчёта — конкретная семья, которой стало чуть теплее жить. Спасибо каждому, кто был рядом: жертвователям, волонтёрам, партнёрам и нашей маленькой, но упрямой команде.",
      directorName: "Марина Клюева",
      directorTitle: "директор фонда",
      partners:
        "АО «Полюс Энерго»\nСеть магазинов «Северный»\nФонд «Новый Север»\nВолонтёрский центр «Поморье»\nАдминистрация Приморского района\nРегиональный ресурсный центр НКО",
    },
    metrics: {
      beneficiaries: 1926,
      volunteers: 214,
      staff: 12,
      events: 58,
      custom: [
        { id: uid(), label: "Посёлков в зоне охвата", value: "14" },
        { id: uid(), label: "Средний размер пожертвования", value: "850 ₽" },
        { id: uid(), label: "Часов волонтёрской работы", value: "5 400" },
      ],
    },
    finance: {
      income: [
        { id: uid(), label: "Грант Фонда президентских грантов", amount: 2400000 },
        { id: uid(), label: "Субсидия регионального министерства труда", amount: 1150000 },
        { id: uid(), label: "Пожертвования частных лиц", amount: 1870000 },
        { id: uid(), label: "Корпоративные партнёры", amount: 940000 },
        { id: uid(), label: "Благотворительные события и ярмарки", amount: 310000 },
      ],
      expenses: [
        { id: uid(), label: "Программная деятельность", amount: 4120000 },
        { id: uid(), label: "Оплата труда команды", amount: 1080000 },
        { id: uid(), label: "Фандрайзинг и коммуникации", amount: 380000 },
        { id: uid(), label: "Аренда, офис и связь", amount: 460000 },
        { id: uid(), label: "Налоги и сборы", amount: 210000 },
      ],
      note: "Отчёт составлен по данным бухгалтерского учёта. Полная бухгалтерская отчётность за год и аудиторское заключение размещаются на сайте фонда в разделе «Документы».",
    },
    programs: [
      {
        id: uid(),
        name: "«Тёплый дом»",
        tag: "Социальная поддержка",
        budget: 1650000,
        participants: 480,
        result:
          "Зимние наборы одежды и продуктовые наборы для 320 семей; число пунктов выдачи выросло с 3 до 6, в двух посёлках появились постоянные волонтёрские команды.",
      },
      {
        id: uid(),
        name: "«Северные стипендии»",
        tag: "Образование",
        budget: 1240000,
        participants: 96,
        result:
          "Ежемесячные стипендии и занятия с наставниками для школьников из удалённых посёлков; 9 из 10 стипендиатов завершили учебный год без троек.",
      },
      {
        id: uid(),
        name: "«Мобильная помощь»",
        tag: "Здоровье",
        budget: 1230000,
        participants: 1350,
        result:
          "Бригада врача, психолога и социального работника посетила 14 посёлков; проведено 1 350 консультаций, 92 человека направлены на дополнительное обследование.",
      },
    ],
    team: [
      {
        id: uid(),
        lastName: "Клюева",
        firstName: "Марина",
        role: "Директор фонда",
        photo: DEMO_IMAGES.portrait1,
      },
      {
        id: uid(),
        lastName: "Овсянкин",
        firstName: "Дмитрий",
        role: "Координатор волонтёров",
        photo: DEMO_IMAGES.portrait2,
      },
      {
        id: uid(),
        lastName: "Репина",
        firstName: "Анна",
        role: "Руководитель программ",
        photo: "",
      },
      {
        id: uid(),
        lastName: "Савельев",
        firstName: "Игорь",
        role: "Финансовый менеджер",
        photo: "",
      },
    ],
    photos: {
      cover: DEMO_IMAGES.cover,
      gallery: [
        {
          id: uid(),
          src: DEMO_IMAGES.photo1,
          caption: "Выдача зимних наборов в пункте «Тёплого дома», декабрь",
        },
        {
          id: uid(),
          src: DEMO_IMAGES.photo2,
          caption: "Занятие стипендиатов с наставником, Архангельск",
        },
        {
          id: uid(),
          src: DEMO_IMAGES.photo3,
          caption: "Мобильная бригада в посёлке Уйма, февраль",
        },
      ],
    },
  };
}
