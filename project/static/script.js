const levels = [
  {
    title: "Срочный вход: подтвердите аккаунт",
    warning: "Внимание: если не войти за 5 минут, доступ будет заблокирован.",
    url: "http://secure-bаnk.by-login.com/auth",
    fieldLabel: "PIN-код карты",
    fieldPlaceholder: "1234",
    buttonText: "Подтвердить и снять блокировку",
    risks: {
      url: {
        title: "Подозрительный URL",
        law: "В домене есть подмена символов и лишние части адреса. По Закону РБ о защите персональных данных обработка персональных данных должна быть безопасной и законной.",
      },
      field: {
        title: "Опасный запрос данных",
        law: "Запрос PIN-кода в форме входа является фишинговым признаком. Сбор таких данных может использоваться для хищения средств (ст. 212 УК РБ).",
      },
      button: {
        title: "Проблема с HTTPS/SSL",
        law: "Сайт использует небезопасный протокол HTTP, нет подтвержденного SSL. Создание ложной страницы для кражи данных влечет уголовную ответственность.",
      },
    },
  },
  {
    title: "Подтвердите вход из нового устройства",
    warning: "Система безопасности требует немедленного ввода SMS-кода.",
    url: "https://belbank-security-check.by.verify-login.net",
    fieldLabel: "SMS-код и CVV",
    fieldPlaceholder: "123 999",
    buttonText: "Сохранить доступ к карте",
    risks: {
      url: {
        title: "Ложный домен",
        law: "Домен построен как цепочка из нескольких слов и не совпадает с официальным адресом. Это типичная маскировка фишинговой страницы.",
      },
      field: {
        title: "Избыточный сбор реквизитов",
        law: "Запрос CVV вместе с кодом подтверждения не используется на обычной странице входа. Это признак попытки хищения данных карты.",
      },
      button: {
        title: "Манипуляция срочностью",
        law: "Давление через срочность - элемент социальной инженерии. Такие действия связаны с незаконным доступом к данным и дальнейшим хищением.",
      },
    },
  },
  {
    title: "Налоговый возврат: проверьте счет",
    warning: "Возврат будет отменен через 3 минуты без подтверждения.",
    url: "http://nalog-gov-by.refund-check.site/pay",
    fieldLabel: "Номер карты получателя",
    fieldPlaceholder: "1111 2222 3333 4444",
    buttonText: "Получить возврат сейчас",
    risks: {
      url: {
        title: "Подделка под госресурс",
        law: "Использование похожего домена под государственный сервис вводит пользователя в заблуждение и нарушает принципы добросовестной обработки данных.",
      },
      field: {
        title: "Критичные данные без причины",
        law: "На этапе 'проверки возврата' не должны требоваться полные реквизиты карты. Это признак фишинга и подготовки к хищению.",
      },
      button: {
        title: "Небезопасное соединение и давление",
        law: "Ссылка начинается с HTTP и сопровождается угрозой потери денег. В совокупности это указывает на мошеннический сценарий.",
      },
    },
  },
];

const found = new Set();
const zones = document.querySelectorAll(".target-zone");
const foundCount = document.getElementById("foundCount");
const levelCount = document.getElementById("levelCount");
const resultPanel = document.getElementById("resultPanel");
const resultTitle = document.getElementById("resultTitle");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const modal = document.getElementById("legalModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModalBtn = document.getElementById("closeModal");
const resetBtn = document.getElementById("resetBtn");

const phishTitle = document.getElementById("phishTitle");
const phishWarning = document.getElementById("phishWarning");
const phishUrl = document.getElementById("phishUrl");
const dangerFieldText = document.getElementById("dangerFieldText");
const dangerFieldInput = document.getElementById("dangerFieldInput");
const phishActionBtn = document.getElementById("phishActionBtn");

const tabTrainer = document.getElementById("tabTrainer");
const tabInfo = document.getElementById("tabInfo");
const tabAbout = document.getElementById("tabAbout");
const themeToggle = document.getElementById("themeToggle");
const trainerView = document.getElementById("trainerView");
const infoView = document.getElementById("infoView");
const aboutView = document.getElementById("aboutView");

let currentLevel = 0;

function showModal(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

function renderLevel() {
  const level = levels[currentLevel];
  phishTitle.textContent = level.title;
  phishWarning.textContent = level.warning;
  phishUrl.textContent = level.url;
  dangerFieldText.textContent = level.fieldLabel;
  dangerFieldInput.placeholder = level.fieldPlaceholder;
  phishActionBtn.textContent = level.buttonText;
  levelCount.textContent = String(currentLevel + 1);
}

function updateProgress() {
  foundCount.textContent = String(found.size);
  if (found.size === 3) {
    if (currentLevel < levels.length - 1) {
      resultTitle.textContent = `Уровень ${currentLevel + 1} пройден!`;
      nextLevelBtn.hidden = false;
    } else {
      resultTitle.textContent = "Поздравляем! Ты прошел(ла) все уровни.";
      nextLevelBtn.hidden = true;
    }
    resultPanel.hidden = false;
  }
}

function clearFoundMarks() {
  zones.forEach((zone) => zone.classList.remove("is-found"));
}

function startLevel(index) {
  currentLevel = index;
  found.clear();
  foundCount.textContent = "0";
  resultPanel.hidden = true;
  nextLevelBtn.hidden = true;
  clearFoundMarks();
  renderLevel();
  closeModal();
}

function onZoneClick(event) {
  const zone = event.currentTarget;
  const zoneName = zone.dataset.zone;
  const risk = levels[currentLevel].risks[zoneName];
  if (!risk) return;

  showModal(risk.title, risk.law);

  if (!found.has(zoneName)) {
    found.add(zoneName);
    zone.classList.add("is-found");
    updateProgress();
  }
}

function resetTrainer() {
  startLevel(0);
}

function nextLevel() {
  if (currentLevel < levels.length - 1) {
    startLevel(currentLevel + 1);
  }
}

function showTrainerTab() {
  tabTrainer.classList.add("is-active");
  tabInfo.classList.remove("is-active");
  tabAbout.classList.remove("is-active");
  trainerView.hidden = false;
  infoView.hidden = true;
  aboutView.hidden = true;
}

function showInfoTab() {
  tabInfo.classList.add("is-active");
  tabTrainer.classList.remove("is-active");
  tabAbout.classList.remove("is-active");
  trainerView.hidden = true;
  infoView.hidden = false;
  aboutView.hidden = true;
}

function showAboutTab() {
  tabAbout.classList.add("is-active");
  tabTrainer.classList.remove("is-active");
  tabInfo.classList.remove("is-active");
  trainerView.hidden = true;
  infoView.hidden = true;
  aboutView.hidden = false;
}

function updateThemeButton() {
  const isDark = document.body.classList.contains("dark-theme");
  themeToggle.textContent = isDark ? "☀ Светлая тема" : "🌙 Темная тема";
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("phishTesterTheme", isDark ? "dark" : "light");
  updateThemeButton();
}

function initTheme() {
  const savedTheme = localStorage.getItem("phishTesterTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
  updateThemeButton();
}

zones.forEach((zone) => zone.addEventListener("click", onZoneClick));
closeModalBtn.addEventListener("click", closeModal);
resetBtn.addEventListener("click", resetTrainer);
nextLevelBtn.addEventListener("click", nextLevel);
tabTrainer.addEventListener("click", showTrainerTab);
tabInfo.addEventListener("click", showInfoTab);
tabAbout.addEventListener("click", showAboutTab);
themeToggle.addEventListener("click", toggleTheme);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

startLevel(0);
initTheme();
