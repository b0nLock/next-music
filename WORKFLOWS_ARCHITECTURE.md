# 🔄 Workflow Pipeline Architecture

## Общая структура CI/CD

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Event                                │
│        (Push на feature/main/master или Pull Request)          │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌────────────┐ ┌─────────┐  ┌──────────────┐
   │  tests.yml │ │quick-   │  │playwright.yml│
   │(полный)    │ │check.yml│  │(E2E only)    │
   │            │ │(быстро) │  │(простой)     │
   └────────────┘ └─────────┘  └──────────────┘
```

---

## Сценарий 1: Full Tests Pipeline (`tests.yml`)

Включает ВСЕ типы тестов, каждый запускается **независимо**.

```
┌─────────────────────────────────────────────────────────────┐
│ Event: Push на main/master/develop/feature/*                │
└──────────────────────┬──────────────────────────────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
 ┌────────┐        ┌──────────┐      ┌───────────┐
 │ Lint   │        │  Unit    │      │   E2E     │
 │ESLint  │        │  Tests   │      │Playwright │
 │        │        │ (Jest)   │      │  Tests    │
 │✓/✗     │        │          │      │           │
 └────────┘        │  ✓/✗     │      │   ✓/✗     │
    │              │          │      │           │
    │              └──────────┘      └───────────┘
    │              (continue-on-      (continue-on-
    │               error: true)       error: true)
    │
    └──────────────────┬─────────────────────┐
                       │                     │
                       ▼                     ▼
                  ┌─────────────────────────────┐
                  │   Test Results Summary      │
                  │  (показывает все результаты)│
                  │  Lint: ✓/✗                 │
                  │  Unit: ✓/✗                 │
                  │  E2E:  ✓/✗                 │
                  └─────────────────────────────┘

Key:
  - Cada job запускается ПАРАЛЛЕЛЬНО
  - Если один падает, остальные ПРОДОЛЖАЮТ
  - Результат: видишь ВСЕ результаты, не только первую ошибку
  - Coverage отправляется на codecov.io
  - Playwright отчеты сохраняются
```

---

## Сценарий 2: Quick Check (`quick-check.yml`)

Запускается при Pull Request - быстрая проверка синтаксиса.

```
┌────────────────────────────────────────────┐
│ Event: Pull Request на main/master         │
└────────────────┬─────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            │
 ┌────────┐   ┌────────┐     │
 │  Lint  │──▶│ Unit   │     │
 │ Check  │   │ Tests  │     │
 │  ✓/✗   │   │ (quick)│     │
 └────────┘   │  ✓/✗   │     │
              └────────┘     │
                   │         │
                   ▼         │
              ┌─────────┐    │
              │ Success │    │
              │  or     │    │
              │ Failure │    │
              └─────────┘    │
                             │
                (При необходимости запускается полный tests.yml)
```

---

## Сценарий 3: E2E Only (`playwright.yml`)

Когда нужны только E2E тесты без unit тестов.

```
┌──────────────────────────────────────┐
│ Event: Push на main/master            │
└──────────────┬───────────────────────┘
               │
               ▼
        ┌──────────────┐
        │   E2E Tests  │
        │  Playwright  │
        │    ✓/✗       │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │   Upload     │
        │  Report to   │
        │ Artifacts    │
        └──────────────┘

Note: continue-on-error: true гарантирует:
  - Отчет будет загружен даже если тесты падают
  - Ты видишь результаты, не только fail
```

---

## Порядок выполнения Jobs

### В `tests.yml`:

```
Time ──────────────────────────────────────────────>

Lint     [████████]
            └──▶ Unit    [████████████]
                    └──▶ E2E     [████████████████████]
                            └──▶ Summary [███]

// Все jobs могут работать параллельно!
// Но Summary ждет пока все кончатся
```

### В `quick-check.yml`:

```
Time ──────────────────────────────────────────────>

Lint     [████]
         └──▶ Unit [████████]
```

---

## Decision Tree: Какой workflow выбрать?

```
               ┌─ Нужно проверить ВСЕ?
               │
            ✓ НЕ ✗
            │   │
            │   └─▶ Нужны только E2E?
            │       │
            │       ✓ ДА ✗
            │       │   │
            │       │   └─▶ Используй playwright.yml
            │       │
            │       └─▶ Используй tests.yml (все сразу)
            │
            └─▶ PR быстрая проверка?
                │
                ✓ ДА
                │
                └─▶ quick-check.yml (синтаксис + базовые unit тесты)
```

---

## 🎯 Интеграция с GitHub

### Status Badges в README

```markdown
## CI/CD Status

[![All Tests](https://github.com/b0nLock/next-music/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/b0nLock/next-music/actions/workflows/tests.yml)
[![Quick Check](https://github.com/b0nLock/next-music/actions/workflows/quick-check.yml/badge.svg?branch=main)](https://github.com/b0nLock/next-music/actions/workflows/quick-check.yml)
[![codecov](https://codecov.io/gh/b0nLock/next-music/branch/main/graph/badge.svg)](https://codecov.io/gh/b0nLock/next-music)
```

### Branch Protection Rules

Рекомендуется настроить в GitHub:

1. Require status checks to pass before merging
2. Выбрать какие workflow должны пройти
3. Require code reviews before merge

```
Settings → Branches → Branch protection rules

Required status checks:
  ✓ tests (Lint)
  ✓ tests (Unit Tests)
  ✓ quick-check (Lint)
  ✓ quick-check (Unit Tests)

Require pull request reviews:
  ✓ Require at least 1 approval
```

---

## ⏱️ Примерное время выполнения

| Workflow      | Время      |
| ------------- | ---------- |
| Lint          | ~30 sec    |
| Unit Tests    | ~2-3 min   |
| E2E Tests     | ~5-10 min  |
| Quick Check   | ~1-2 min   |
| Full Pipeline | ~10-15 min |

---

## 📌 Важные моменты

### `continue-on-error: true` vs `if: failure()`

```yaml
# Вариант 1: Продолжить выполнение (рекомендуется для тестов)
- name: Run unit tests
  run: npm test
  continue-on-error: true # Job продолжается, статус "passed" но тесты могли упасть

# Вариант 2: Условное выполнение
- name: Report failure
  if: failure()
  run: echo "Tests failed!" # Запустится ТОЛЬКО если предыдущий step упал
```

### `needs: [...]` vs `if: always()`

```yaml
# needs: указывает зависимость между jobs
jobs:
  summary:
    needs: [lint, unit-tests, e2e-tests] # Ждет все три
    if: always() # Запуститься ВСЕГДА, даже если зависимые упали
```

---

## 🔍 Отладка Workflows

### Просмотр логов:

1. GitHub Repo → Actions tab
2. Кликни на workflow run
3. Кликни на specific job
4. Раскрой конкретный step

### Просмотр артефактов:

1. В workflow run page внизу "Artifacts"
2. Скачай playwright-report.zip
3. Распакуй и открой index.html в браузер

### Локальная проверка синтаксиса YAML:

```bash
# Установи yamllint
npm install -g yamllint

# Проверь syntax
yamllint .github/workflows/tests.yml
```
