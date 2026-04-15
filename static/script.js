// Mixed-format campaign: spot phishing, answer quiz, classify examples.
const levels = [
  {
    mode: "spot",
    mission: "Найди 3 признаки поддельной страницы.",
    title: "Срочный вход: подтвердите аккаунт",
    warning: "Если не войти за 5 минут, доступ будет заблокирован.",
    url: "http://secure-bаnk.by-login.com/auth",
    fieldLabel: "PIN-код карты",
    fieldPlaceholder: "1234",
    buttonText: "Подтвердить и снять блокировку",
    risks: {
      url: { title: "Подозрительный URL", law: "Подмена символов в домене и лишние части адреса указывают на фишинговый ресурс." },
      field: { title: "Опасный запрос данных", law: "Запрос PIN-кода в форме входа может использоваться для хищения средств (ст. 212 УК РБ)." },
      button: { title: "Проблема с HTTPS/SSL", law: "Небезопасный HTTP и отсутствие проверяемого сертификата повышают риск кражи данных." },
    },
  },
  {
    mode: "quiz",
    mission: "Выбери самое безопасное действие.",
    question: "Тебе пришло письмо от банка со ссылкой и просьбой срочно войти. Что делать?",
    options: [
      { text: "Перейти по ссылке и проверить, что внутри", correct: false, feedback: "Переход по ссылке из письма может привести на фишинговый сайт." },
      { text: "Открыть официальный сайт банка вручную и проверить уведомления", correct: true, feedback: "Верно: лучше открывать сайт вручную или через закладки." },
      { text: "Отправить письмо другу, чтобы он проверил ссылку", correct: false, feedback: "Это не решает проблему и может распространить фишинговую ссылку." },
    ],
  },
  {
    mode: "classify",
    mission: "Классифицируй 3 примера: где фишинг, а где нет.",
    title: "Разбор сообщений",
    items: [
      { text: "support@pay-pol.com: 'Срочно подтвердите карту в течение 10 минут'", answer: "phish" },
      { text: "Официальное push-уведомление из банковского приложения без ссылок", answer: "safe" },
      { text: "SMS: 'Вы выиграли приз, введите пароль от почты для получения'", answer: "phish" },
    ],
  },
  {
    mode: "spot",
    mission: "Сценарий доставки: найди 3 нарушения.",
    title: "Доставка отменится без подтверждения",
    warning: "Подтвердите заказ немедленно, иначе курьер не приедет.",
    url: "https://ozon-delivery-check.support-order.ru",
    fieldLabel: "Пароль от аккаунта",
    fieldPlaceholder: "Введите пароль",
    buttonText: "Сохранить доставку",
    risks: {
      url: { title: "Сторонний домен", law: "Официальные площадки не просят подтверждать вход на неизвестных доменах." },
      field: { title: "Запрос пароля в форме доставки", law: "Пароль нельзя вводить на страницах, пришедших по ссылке." },
      button: { title: "Давление через угрозу", law: "Мошенники используют страх отмены заказа для ускорения решения." },
    },
  },
  {
    mode: "quiz",
    mission: "Проверь стратегию защиты аккаунта.",
    question: "Какой набор действий лучше всего защищает от фишинга?",
    options: [
      { text: "Одинаковый пароль везде и частая смена почты", correct: false, feedback: "Одинаковый пароль - риск для всех аккаунтов сразу." },
      { text: "2FA, уникальные пароли и проверка домена перед вводом данных", correct: true, feedback: "Это лучшая базовая комбинация защиты." },
      { text: "Антивирус без обновлений и отключенные уведомления", correct: false, feedback: "Без обновлений и контроля оповещений защита неполная." },
    ],
  },
  {
    mode: "classify",
    mission: "Отметь, какие ссылки выглядят фишинговыми.",
    title: "Линк-детектив",
    items: [
      { text: "https://secure.gov.by/profile", answer: "safe" },
      { text: "http://secure-gov-by.verify-id.site/login", answer: "phish" },
      { text: "https://belarusbank.by/security", answer: "safe" },
    ],
  },
  {
    mode: "spot",
    mission: "Уровень 'стипендия': ищи 3 красных флага.",
    title: "Подтвердите получение стипендии",
    warning: "Выплата сгорит через 20 минут без верификации.",
    url: "http://edu-grants.by.verify-student.info",
    fieldLabel: "Паспорт и пароль от кабинета",
    fieldPlaceholder: "Серия номер / пароль",
    buttonText: "Разблокировать выплату",
    risks: {
      url: { title: "Подмена официального ресурса", law: "Образовательные порталы не проводят верификацию на сторонних доменах." },
      field: { title: "Лишние персональные данные", law: "Запрос паспорта и пароля одновременно - фишинговый признак." },
      button: { title: "Страх потери денег", law: "Фразы о блокировке выплаты применяются для манипуляции." },
    },
  },
  {
    mode: "classify",
    mission: "Оцени поведение страницы и ее запросы.",
    title: "Поведенческие признаки",
    items: [
      { text: "Сайт просит только логин и пароль, HTTPS корректен, домен знакомый", answer: "safe" },
      { text: "Страница требует код из SMS и PIN карты в одном окне", answer: "phish" },
      { text: "Сервис показывает ошибку сертификата и просит 'игнорировать'", answer: "phish" },
    ],
  },
  {
    mode: "quiz",
    mission: "Финальный теоретический выбор.",
    question: "Что делать, если ты уже ввел пароль на подозрительном сайте?",
    options: [
      { text: "Ничего, если страница закрыта", correct: false, feedback: "Риск остается даже после закрытия страницы." },
      { text: "Сразу сменить пароль, включить 2FA и проверить активные сессии", correct: true, feedback: "Верно: это минимальный план экстренной защиты." },
      { text: "Подождать, вдруг ничего не случится", correct: false, feedback: "Ожидание повышает шанс взлома." },
    ],
  },
  {
    mode: "spot",
    mission: "Финал: максимальная концентрация, найди все 3 угрозы.",
    title: "Служба безопасности банка",
    warning: "Подтвердите личность для отмены подозрительного перевода.",
    url: "http://secure-bank-alert.recovery-safe.help",
    fieldLabel: "Полные данные карты + код из звонка",
    fieldPlaceholder: "Номер карты / код",
    buttonText: "Отменить перевод",
    risks: {
      url: { title: "Сервис-посредник вместо банка", law: "Адрес не относится к официальному банковскому домену." },
      field: { title: "Полный набор секретных данных", law: "Передача полных реквизитов карты создает прямой риск хищения." },
      button: { title: "Страх немедленной потери денег", law: "Экстренные сообщения используются мошенниками для давления." },
    },
  },
  {
    mode: "quiz",
    mission: "Проверка реакции на звонки 'из службы безопасности'.",
    question: "Тебе звонят и просят продиктовать код из SMS для отмены перевода. Что делать?",
    options: [
      { text: "Продиктовать код, если собеседник знает мое имя", correct: false, feedback: "Знание имени не подтверждает подлинность звонка." },
      { text: "Не сообщать код, завершить звонок и перезвонить в банк по официальному номеру", correct: true, feedback: "Верно: коды подтверждения никому не передаются." },
      { text: "Сообщить только половину кода", correct: false, feedback: "Любая часть кода может использоваться для атаки." },
    ],
  },
  {
    mode: "classify",
    mission: "Определи безопасность доменов в сообщениях.",
    title: "Домены и поддомены",
    items: [
      { text: "https://belarusbank.by", answer: "safe" },
      { text: "https://belarusbank.by.verify-check.site", answer: "phish" },
      { text: "https://login.belarusbank.by", answer: "safe" },
    ],
  },
  {
    mode: "spot",
    mission: "Тема 'налоги': найди 3 нарушения.",
    title: "Налоговая проверка аккаунта",
    warning: "Проверка истекает через 4 минуты.",
    url: "http://nalog-confirm.safe-pay-check.ru/verify",
    fieldLabel: "Пароль от почты",
    fieldPlaceholder: "Введите пароль",
    buttonText: "Подтвердить налоговый профиль",
    risks: {
      url: { title: "Поддельный налоговый домен", law: "Госструктуры не используют случайные коммерческие домены для авторизации." },
      field: { title: "Запрос нерелевантных данных", law: "Пароль от почты не нужен для налоговой верификации." },
      button: { title: "Таймер давления", law: "Сжатые сроки используются для поспешных действий без проверки." },
    },
  },
  {
    mode: "quiz",
    mission: "Проверь понимание признаков сертификата.",
    question: "Что означает предупреждение браузера о недоверенном сертификате?",
    options: [
      { text: "Сайт всегда безопасен, можно продолжать", correct: false, feedback: "Предупреждение сертификата - серьезный риск." },
      { text: "Нужно закрыть страницу и проверить адрес вручную", correct: true, feedback: "Верно: нельзя игнорировать предупреждения SSL." },
      { text: "Достаточно обновить страницу 2-3 раза", correct: false, feedback: "Обновление не устраняет проблему недоверенного сертификата." },
    ],
  },
  {
    mode: "classify",
    mission: "Проверка сообщений в мессенджерах.",
    title: "Чат и ссылки",
    items: [
      { text: "Сообщение от друга: 'Проголосуй срочно', странная сокращенная ссылка", answer: "phish" },
      { text: "Сообщение в официальном канале банка без ссылок, только инфо", answer: "safe" },
      { text: "Просьба отправить код из SMS 'для проверки аккаунта'", answer: "phish" },
    ],
  },
  {
    mode: "spot",
    mission: "Сценарий маркетплейса: найди 3 признака подделки.",
    title: "Возврат за заказ",
    warning: "Возврат недоступен без моментального подтверждения.",
    url: "https://refund-market-by.fast-check.help",
    fieldLabel: "CVV карты",
    fieldPlaceholder: "3 цифры",
    buttonText: "Получить возврат",
    risks: {
      url: { title: "Несовпадающий домен", law: "Возвраты должны проводиться на официальной платформе сервиса." },
      field: { title: "Запрос CVV", law: "CVV нельзя вводить на страницах сомнительного происхождения." },
      button: { title: "Нереалистично срочный возврат", law: "Срочность часто используется в мошеннических схемах." },
    },
  },
  {
    mode: "quiz",
    mission: "Решение для публичного Wi-Fi.",
    question: "Ты открыл банковский сайт через открытый Wi-Fi в кафе. Как действовать безопаснее?",
    options: [
      { text: "Войти сразу, если интернет работает быстро", correct: false, feedback: "Скорость не связана с безопасностью." },
      { text: "Избегать финансовых входов в открытых сетях, использовать мобильный интернет", correct: true, feedback: "Верно: открытые сети повышают риск перехвата данных." },
      { text: "Передать другу телефон и попросить проверить", correct: false, feedback: "Это не защищает соединение." },
    ],
  },
  {
    mode: "classify",
    mission: "Оцени поведение писем по содержанию.",
    title: "Почтовый фильтр",
    items: [
      { text: "Письмо требует немедленно обновить пароль по кнопке 'Verify now'", answer: "phish" },
      { text: "Письмо от сервиса о входе с нового устройства без ссылки и с рекомендацией открыть приложение", answer: "safe" },
      { text: "Письмо с вложением .exe якобы от курьерской службы", answer: "phish" },
    ],
  },
  {
    mode: "spot",
    mission: "Уровень 'соцсеть': найди 3 уязвимости.",
    title: "Восстановление страницы",
    warning: "Профиль будет удален через 10 минут без подтверждения.",
    url: "http://social-help-account.verify-user.net",
    fieldLabel: "Резервный пароль",
    fieldPlaceholder: "Введите резервный пароль",
    buttonText: "Сохранить страницу",
    risks: {
      url: { title: "Ложная служба поддержки", law: "Официальные соцсети не используют случайные технические домены." },
      field: { title: "Запрос пароля в форме восстановления", law: "Пароли нельзя передавать через формы из ссылок сообщений." },
      button: { title: "Угроза удаления аккаунта", law: "Эмоциональное давление направлено на обход критического мышления." },
    },
  },
  {
    mode: "quiz",
    mission: "Финальный вопрос: закрепи правила безопасности.",
    question: "Какой признак сам по себе чаще всего указывает на фишинг?",
    options: [
      { text: "Точная копия дизайна известного сайта", correct: false, feedback: "Дизайн можно легко подделать, нужен комплекс проверок." },
      { text: "Просьба срочно передать секретные данные (PIN/CVV/SMS-код)", correct: true, feedback: "Верно: это один из самых сильных фишинговых индикаторов." },
      { text: "Светлая тема интерфейса", correct: false, feedback: "Оформление темы не связано с фишингом." },
    ],
  },
];

// Global game state shared across all level modes.
const state = {
  currentLevel: 0,
  score: 0,
  lives: 5,
  gameOver: false,
  levelCompleted: false,
  found: new Set(),
  mistakes: 0,
  classifyAnswers: {},
};

const zones = document.querySelectorAll(".target-zone");
const foundCount = document.getElementById("foundCount");
const foundTotal = document.getElementById("foundTotal");
const levelCount = document.getElementById("levelCount");
const totalLevels = document.getElementById("totalLevels");
const scoreCount = document.getElementById("scoreCount");
const livesCount = document.getElementById("livesCount");
const missionText = document.getElementById("missionText");
const resultPanel = document.getElementById("resultPanel");
const resultTitle = document.getElementById("resultTitle");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const modal = document.getElementById("legalModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModalBtn = document.getElementById("closeModal");
const resetBtn = document.getElementById("resetBtn");

const spotMode = document.getElementById("spotMode");
const quizMode = document.getElementById("quizMode");
const classifyMode = document.getElementById("classifyMode");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const classifyTitle = document.getElementById("classifyTitle");
const classifyList = document.getElementById("classifyList");
const checkClassifyBtn = document.getElementById("checkClassifyBtn");

const phishTitle = document.getElementById("phishTitle");
const phishWarning = document.getElementById("phishWarning");
const phishUrl = document.getElementById("phishUrl");
const dangerFieldText = document.getElementById("dangerFieldText");
const dangerFieldInput = document.getElementById("dangerFieldInput");
const phishActionBtn = document.getElementById("phishActionBtn");
const phishCard = document.querySelector(".browser-card--phish");

const tabTrainer = document.getElementById("tabTrainer");
const tabInfo = document.getElementById("tabInfo");
const tabAbout = document.getElementById("tabAbout");
const themeToggle = document.getElementById("themeToggle");
const trainerView = document.getElementById("trainerView");
const infoView = document.getElementById("infoView");
const aboutView = document.getElementById("aboutView");

function showModal(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

function getCurrentLevel() {
  return levels[state.currentLevel];
}

function getTargetCount(level) {
  if (level.mode === "spot") return 3;
  if (level.mode === "classify") return level.items.length;
  return 1;
}

// Reuse one header scoreboard for every game mode.
function refreshStats(progress) {
  levelCount.textContent = String(state.currentLevel + 1);
  totalLevels.textContent = String(levels.length);
  scoreCount.textContent = String(state.score);
  livesCount.textContent = String(state.lives);
  foundCount.textContent = String(progress);
  foundTotal.textContent = String(getTargetCount(getCurrentLevel()));
}

// Show only one active mode block per level.
function switchMode(modeName) {
  spotMode.hidden = modeName !== "spot";
  quizMode.hidden = modeName !== "quiz";
  classifyMode.hidden = modeName !== "classify";
}

function renderSpot(level) {
  phishTitle.textContent = level.title;
  phishWarning.textContent = level.warning;
  phishUrl.textContent = level.url;
  dangerFieldText.textContent = level.fieldLabel;
  dangerFieldInput.placeholder = level.fieldPlaceholder;
  phishActionBtn.textContent = level.buttonText;
  zones.forEach((zone) => zone.classList.remove("is-found"));
}

// Quiz mode renders answer options dynamically per level.
function renderQuiz(level) {
  quizQuestion.textContent = level.question;
  quizOptions.innerHTML = "";
  level.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = option.text;
    btn.addEventListener("click", () => handleQuizAnswer(option));
    quizOptions.appendChild(btn);
  });
}

// Classification mode builds rows and local per-item selections.
function renderClassify(level) {
  classifyTitle.textContent = level.title;
  classifyList.innerHTML = "";
  state.classifyAnswers = {};
  level.items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "classify-item";
    row.innerHTML = `<p>${item.text}</p>`;

    const actions = document.createElement("div");
    actions.className = "classify-actions";

    const safeBtn = document.createElement("button");
    safeBtn.type = "button";
    safeBtn.className = "mini-btn";
    safeBtn.textContent = "Безопасно";

    const phishBtn = document.createElement("button");
    phishBtn.type = "button";
    phishBtn.className = "mini-btn";
    phishBtn.textContent = "Фишинг";

    const select = (value) => {
      state.classifyAnswers[index] = value;
      safeBtn.classList.toggle("is-selected", value === "safe");
      phishBtn.classList.toggle("is-selected", value === "phish");
      refreshStats(Object.keys(state.classifyAnswers).length);
    };

    safeBtn.addEventListener("click", () => select("safe"));
    phishBtn.addEventListener("click", () => select("phish"));

    actions.appendChild(safeBtn);
    actions.appendChild(phishBtn);
    row.appendChild(actions);
    classifyList.appendChild(row);
  });
}

function renderLevel() {
  const level = getCurrentLevel();
  missionText.textContent = `Миссия: ${level.mission}`;
  switchMode(level.mode);
  if (level.mode === "spot") renderSpot(level);
  if (level.mode === "quiz") renderQuiz(level);
  if (level.mode === "classify") renderClassify(level);
  refreshStats(0);
}

// Unified penalty path for all wrong actions.
function applyMistake(penaltyText) {
  if (state.gameOver || state.levelCompleted) return;

  state.lives -= 1;
  state.score = Math.max(0, state.score - 5);
  state.mistakes += 1;
  if (phishCard) {
    phishCard.classList.remove("is-alert");
    void phishCard.offsetWidth;
    phishCard.classList.add("is-alert");
  }

  if (state.lives <= 0) {
    state.lives = 0;
    state.gameOver = true;
    state.levelCompleted = true;
    refreshStats(0);
    resultTitle.textContent = "Игра окончена: жизни закончились";
    resultPanel.hidden = false;
    nextLevelBtn.hidden = true;
    showModal("Игра окончена", "Жизни закончились. Нажми Сброс, чтобы начать заново.");
    return;
  }
  showModal("Ошибка", `${penaltyText} Потеря жизни и -5 очков.`);
  refreshStats(0);
}

function finishLevel(extraMessage = "") {
  if (state.levelCompleted) return;
  state.levelCompleted = true;

  const bonus = Math.max(5, 20 - state.mistakes * 2);
  state.score += bonus;
  const isLast = state.currentLevel === levels.length - 1;
  resultTitle.textContent = isLast
    ? `Поздравляем! Ты прошел(ла) все уровни. Итог: ${state.score} очков`
    : `Уровень ${state.currentLevel + 1} пройден! Бонус: +${bonus} очков${extraMessage}`;
  resultPanel.hidden = false;
  nextLevelBtn.hidden = isLast;
  refreshStats(getTargetCount(getCurrentLevel()));
}

// Spot mode: click highlighted phishing zones.
function handleSpotClick(event) {
  event.stopPropagation();
  if (state.gameOver || state.levelCompleted || getCurrentLevel().mode !== "spot") return;

  const zoneName = event.currentTarget.dataset.zone;
  const risk = getCurrentLevel().risks[zoneName];
  if (!risk) return;

  if (!state.found.has(zoneName)) {
    state.found.add(zoneName);
    event.currentTarget.classList.add("is-found");
    state.score += 10;
    showModal(`Правильный ответ: ${risk.title}`, risk.law);
    refreshStats(state.found.size);
    if (state.found.size === 3) finishLevel();
  } else {
    showModal(`Правильный ответ: ${risk.title}`, "Этот правильный признак уже отмечен.");
  }
}

function handleSpotMiss(event) {
  if (getCurrentLevel().mode !== "spot") return;
  if (state.levelCompleted) return;
  if (event.target.closest(".target-zone")) return;
  applyMistake("Это не ключевая уязвимость на этом уровне.");
}

function handleQuizAnswer(option) {
  if (state.gameOver || state.levelCompleted || getCurrentLevel().mode !== "quiz") return;
  if (option.correct) {
    state.score += 15;
    refreshStats(1);
    showModal("Правильный ответ", option.feedback);
    finishLevel();
  } else {
    applyMistake(option.feedback);
  }
}

// Validate all classify answers in one action.
function handleClassifyCheck() {
  if (state.gameOver || state.levelCompleted || getCurrentLevel().mode !== "classify") return;
  const level = getCurrentLevel();
  const answered = Object.keys(state.classifyAnswers).length;
  refreshStats(answered);
  if (answered < level.items.length) {
    showModal("Не закончено", "Выбери ответ для каждого примера перед проверкой.");
    return;
  }

  let correct = 0;
  level.items.forEach((item, index) => {
    if (state.classifyAnswers[index] === item.answer) correct += 1;
  });

  if (correct === level.items.length) {
    state.score += 15;
    showModal("Правильный ответ", "Все примеры отмечены верно.");
    finishLevel(" • Отличная классификация!");
  } else {
    applyMistake(`Правильных ответов: ${correct}/${level.items.length}.`);
  }
}

function startLevel(index) {
  state.currentLevel = index;
  state.levelCompleted = false;
  state.found.clear();
  state.classifyAnswers = {};
  state.mistakes = 0;
  resultPanel.hidden = true;
  nextLevelBtn.hidden = true;
  closeModal();
  renderLevel();
}

function resetTrainer() {
  state.score = 0;
  state.lives = 5;
  state.gameOver = false;
  startLevel(0);
}

function nextLevel() {
  if (state.gameOver) return;
  if (state.currentLevel < levels.length - 1) startLevel(state.currentLevel + 1);
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
  if (savedTheme === "dark") document.body.classList.add("dark-theme");
  updateThemeButton();
}

zones.forEach((zone) => zone.addEventListener("click", handleSpotClick));
phishCard.addEventListener("click", handleSpotMiss);
checkClassifyBtn.addEventListener("click", handleClassifyCheck);
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

resetTrainer();
initTheme();
