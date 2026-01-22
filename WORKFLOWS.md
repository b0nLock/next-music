# CI/CD Workflows

Проект содержит несколько автоматизированных workflow для проверки качества кода и тестирования.

## 📋 Доступные Workflows

### 1. **All Tests** (`tests.yml`) - Полный набор тестов

Запускается при:

- Push на `main`, `master`, `develop` или `feature/*` ветки
- Pull Request на `main` или `master`

**Включает:**

- ✅ ESLint проверка (Lint)
- ✅ Unit тесты (Jest) с coverage отчетом
- ✅ E2E тесты (Playwright)
- ✅ Итоговый отчет о статусе всех тестов

**Особенности:**

- Каждый тип теста запускается **независимо** (`continue-on-error: true`)
- Если один тест падает, остальные продолжают работать
- Coverage отчеты загружаются на codecov.io
- Playwright отчеты сохраняются как artifacts

### 2. **Playwright Tests** (`playwright.yml`) - Только E2E тесты

Запускается при:

- Push на `main` или `master` ветки
- Pull Request на `main` или `master`

**Включает:**

- ✅ Playwright E2E тесты
- ✅ Артефакт с отчетом (30 дней хранения)

**Используй когда:**

- Нужно быстро проверить E2E тесты
- Пушишь боевой код без изменения unit тестов

### 3. **Quick Check** (`quick-check.yml`) - Быстрая проверка для PR

Запускается при:

- Pull Request на `main` или `master`

**Включает:**

- ✅ Быстрая ESLint проверка
- ✅ Unit тесты (Jest) в режиме quick check

**Используй для:**

- Быстрой обратной связи на PR
- Проверки синтаксиса и базовых unit тестов

---

## 🔑 Ключевые параметры

### `continue-on-error: true`

```yaml
- name: Run unit tests
  run: npm test -- --coverage --maxWorkers=1
  continue-on-error: true
```

**Что это значит:**

- Если тест падает, workflow не останавливается
- Остальные тесты запускаются полностью
- В итоге ты видишь ALL результаты, а не только первую ошибку

### `needs: [lint, unit-tests, e2e-tests]`

```yaml
needs: [lint, unit-tests, e2e-tests]
if: always()
```

**Что это значит:**

- Job зависит от других jobs, но запускается ТОЛЬКО если они все завершены
- `if: always()` гарантирует что summary job запустится в любом случае

### `maxWorkers=1`

```yaml
run: npm test -- --coverage --maxWorkers=1
```

**Почему это нужно:**

- В CI среде (GitHub Actions) нельзя параллелить тесты
- Одновременные worker-ы вызовут ошибки типизации

---

## 📊 Статус Badge для README

Добавь в главный README:

```markdown
[![All Tests](https://github.com/b0nLock/next-music/actions/workflows/tests.yml/badge.svg)](https://github.com/b0nLock/next-music/actions/workflows/tests.yml)
[![Quick Check](https://github.com/b0nLock/next-music/actions/workflows/quick-check.yml/badge.svg)](https://github.com/b0nLock/next-music/actions/workflows/quick-check.yml)
```

---

## 🏃 Локальное запускание

### Все тесты:

```bash
npm run lint && npm test -- --maxWorkers=1 && npx playwright test
```

### Только lint:

```bash
npm run lint
```

### Только unit тесты:

```bash
npm test
```

### Только E2E тесты:

```bash
npm run e2e
# или
npx playwright test
```

### С coverage:

```bash
npm test -- --coverage
```

---

## 📈 Покрытие кода (Coverage)

Coverage отчеты автоматически отправляются на **codecov.io**.

Чтобы добавить бейдж в README:

```markdown
[![codecov](https://codecov.io/gh/b0nLock/next-music/branch/main/graph/badge.svg)](https://codecov.io/gh/b0nLock/next-music)
```

---

## ❌ Что если тест упал в CI?

1. **Проверь лог:**
   - Зайди на GitHub Actions tab
   - Кликни на workflow run
   - Посмотри какой именно step упал

2. **Скачай артефакты:**
   - Playwright reports находятся в artifacts
   - Coverage files тоже там же

3. **Воспроизведи локально:**

   ```bash
   npm install
   npm run lint
   npm test -- --maxWorkers=1
   npx playwright test
   ```

4. **Зафиксь и пушь:**
   ```bash
   git add .
   git commit -m "fix: address CI test failures"
   git push
   ```

---

## 🚀 Лучшие практики

✅ **Делай:**

- Всегда запускай `npm run lint` перед commit
- Запускай unit тесты локально: `npm test`
- Для E2E: убедись что dev сервер запущен

❌ **Не делай:**

- Не игнорируй ESLint ошибки
- Не пушь падающие тесты
- Не коммитай только E2E тесты без unit тестов

---

## 📞 Помощь

Если workflow не запускается:

1. Проверь что файлы находятся в `.github/workflows/`
2. Убедись в синтаксисе YAML (отступы важны!)
3. Проверь что у тебя есть permissions на Actions в репо
