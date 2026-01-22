# Testing & CI/CD Complete Setup

## 📊 Что у нас есть

### ✅ Unit Tests (Jest)
```bash
npm test                          # Запустить unit тесты
npm run test:watch               # Смотреть режим (перезапуск при изменении файлов)
npm run test:coverage            # С отчетом покрытия
```

**Файлы тестов:** `pages/tracks/__tests__/`
- `create.integration.test.tsx` - 3 теста для Step 0 формы
- `fetchTracks.test.ts` - 3 теста для fetchTracks action creator

### ✅ E2E Tests (Playwright)
```bash
npm run test:e2e                 # Запустить E2E тесты
npm run test:e2e:ui              # С интерактивным UI
```

**Файлы тестов:** `e2e/`
- `track-create.spec.ts` - 12 тестов для создания трека
- `tracks.spec.ts` - 7 тестов для списка треков
- `create.spec.ts` - Дополнительные тесты

### ✅ Lint/Format
```bash
npm run lint                     # Проверить код на ошибки ESLint
```

---

## 🚀 Комбинированные команды

### Быстрая локальная проверка перед commit:
```bash
npm run test:quick
# = npm run lint && npm run test -- --maxWorkers=1
```

### Полный набор тестов (как в CI):
```bash
npm run test:all
# = npm run lint && npm run test:coverage -- --maxWorkers=1 && npm run test:e2e
```

### Для разработки с автоматическим перезапуском:
```bash
npm run test:watch
```

---

## 🔄 GitHub Actions Workflows

### 1. **Full Tests** (`.github/workflows/tests.yml`)
- Запускается: Push на `main/master/develop/feature/*` или PR
- Включает: Lint + Unit Tests + E2E Tests
- Особенность: **Независимый запуск** - если один падает, остальные продолжают
- Результат: Полный отчет о всех тестах

### 2. **Quick Check** (`.github/workflows/quick-check.yml`)
- Запускается: Только PR на `main/master`
- Включает: Lint + Quick Unit Tests (без E2E)
- Особенность: Быстрая обратная связь (~1-2 мин)

### 3. **Playwright Only** (`.github/workflows/playwright.yml`)
- Запускается: Push на `main/master`
- Включает: Только E2E тесты
- Особенность: Простой workflow для быстрой E2E проверки

---

## 📋 Чек-лист перед Push

- [ ] `npm run test:quick` - все зелено
- [ ] `npm run test:all` - полный набор тестов
- [ ] Нет новых ESLint warning'ов
- [ ] Все тесты относятся к моим изменениям

```bash
# Скрипт для быстрой проверки:
npm run test:quick && echo "✅ Ready to push!"
```

---

## 📈 Coverage Reports

Coverage отправляется автоматически на **codecov.io** при каждом push.

### Локально смотреть coverage:
```bash
npm run test:coverage
# Откроет `coverage/lcov-report/index.html` в браузер
```

### Требуемый coverage:
- **Branches:** >80%
- **Functions:** >80%
- **Lines:** >80%
- **Statements:** >80%

---

## 🐛 Отладка тестов

### Если E2E тесты падают:

1. **Проверь что dev сервер запущен:**
```bash
npm run dev  # в одном терминале
npm run test:e2e  # в другом
```

2. **Посмотри интерактивный UI:**
```bash
npm run test:e2e:ui
```

3. **Конкретный тест:**
```bash
npx playwright test e2e/track-create.spec.ts -g "should fill track info"
```

### Если Unit тесты падают:

1. **Посмотри логи:**
```bash
npm test -- --verbose
```

2. **Watch mode:**
```bash
npm run test:watch
```

3. **Конкретный файл:**
```bash
npm test -- fetchTracks.test.ts
```

---

## 📁 Структура файлов

```
client/
├── .github/workflows/
│   ├── tests.yml          # Полный набор тестов
│   ├── quick-check.yml    # Быстрая проверка для PR
│   └── playwright.yml     # Только E2E тесты
│
├── pages/tracks/__tests__/
│   ├── create.integration.test.tsx    # Unit tests для Create
│   └── fetchTracks.test.ts            # Unit tests для API
│
├── e2e/
│   ├── track-create.spec.ts      # E2E для создания трека
│   ├── tracks.spec.ts            # E2E для списка треков
│   └── create.spec.ts            # Дополнительные E2E
│
├── jest.config.js         # Jest конфиг
├── jest.setup.js          # Jest setup (jsdom, testing-library)
├── playwright.config.ts   # Playwright конфиг
│
└── WORKFLOWS.md           # Документация по workflows
```

---

## 🎯 Типичные сценарии использования

### Сценарий 1: Разработка новой feature
```bash
# 1. Создай ветку
git checkout -b feature/my-feature

# 2. Разрабатывай с автоматическим тестированием
npm run test:watch

# 3. Перед push - полная проверка
npm run test:all

# 4. Push и PR
git push origin feature/my-feature
# Автоматически запустится: quick-check.yml + tests.yml
```

### Сценарий 2: Исправление бага
```bash
# 1. Создай ветку
git checkout -b fix/some-bug

# 2. Напиши тест который падает на баге
npm test -- --watch

# 3. Исправь баг пока тест не пройдет
# (файл сохранится, jest перезапустится)

# 4. Full check
npm run test:all

# 5. Push
git push origin fix/some-bug
```

### Сценарий 3: Проверка перед merge
```bash
# Если PR имеет branch protection rules:
# 1. Все checks (lint, tests) должны быть ✅
# 2. Нужно минимум 1 approval
# 3. Нельзя merge пока checks не пройдут
```

---

## 🔐 Best Practices

✅ **Делай:**
- Запускай `npm run test:quick` перед каждым commit
- Пиши unit тесты для новых функций
- Пиши E2E тесты для пользовательских flow'ов
- Смотри coverage отчеты

❌ **Не делай:**
- Не игнорируй lint ошибки
- Не пушь падающие тесты
- Не коммитай с `// eslint-disable` без объяснения
- Не удаляй существующие тесты

---

## 📚 Дополнительно

Подробнее о workflows: читай [WORKFLOWS.md](./WORKFLOWS.md)

Архитектура и диаграммы: читай [WORKFLOWS_ARCHITECTURE.md](./WORKFLOWS_ARCHITECTURE.md)

