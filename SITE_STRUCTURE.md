# AIBusiness.vc — Site Structure
# Архитектура сайта на 100,000+ страниц

## Принцип: Максимум 3 уровня глубины URL

```
aibusiness.vc/[раздел]/[подраздел]/[страница]
```

---

## НАВИГАЦИЯ (Top-Level Menu)

```
News | Solo | Startups | VC | B2B | Government | Tools | Models | Learn | Materials
```

**10 разделов.** Careers, Regulation, Data — живут внутри соответствующих разделов как подразделы.

---

## ПОЛНАЯ СТРУКТУРА

### 1. /news/ — Новостная лента
Для людей. Эмоциональный, интересный контент. Accordion-формат.

```
/news/                              ← Лента новостей (accordion)
/news/[slug]                        ← Отдельная страница новости (для SEO/шаринга)
```

---

### 2. /solo/ — Заработок для индивидуалов
Истории дохода, гайды, income reports. Для людей, с эмоциями и цифрами.

```
/solo/                              ← Hub: все статьи Solo
/solo/[article-slug]                ← Статья (гайд, income report, case study)
```

---

### 3. /startups/ — AI Стартапы
Revenue reports, funding rounds, exit stories, startup profiles.

```
/startups/                          ← Hub: статьи + featured стартапы
/startups/[article-slug]            ← Статья (analysis, revenue report)
/startups/companies/                ← Hub: база AI-компаний
/startups/companies/[company-slug]  ← Профиль стартапа (программатический)
/startups/exits/                    ← Hub: M&A и exits
/startups/exits/[deal-slug]         ← Конкретная сделка
```

**Программатический потенциал:** 10,000+ company profiles

---

### 4. /vc/ — Venture Capital
Фонды, акселераторы, impact investing, раунды финансирования.

```
/vc/                                ← Hub: VC-вертикаль
/vc/funds/                          ← Hub: все VC фонды
/vc/funds/[fund-slug]               ← Профиль фонда
/vc/accelerators/                   ← Hub: акселераторы
/vc/accelerators/[acc-slug]         ← Профиль акселератора
/vc/impact/                         ← Hub: Impact investing в AI
/vc/impact/[topic-slug]             ← ESG/SDG/Climate AI статья
/vc/funding/                        ← Hub: раунды и статистика
/vc/funding/weekly/[date]           ← Еженедельный AI Funding Report
/vc/funding/[sector-slug]           ← AI Funding by Sector
/vc/funding/[country-slug]          ← AI Funding by Country
/vc/competitions/                   ← Hub: конкурсы и гранты
/vc/competitions/[comp-slug]        ← Конкурс/грант профиль
```

**Программатический потенциал:** 500+ funds, 164+ accelerators, 100+ competitions

---

### 5. /b2b/ — AI для бизнеса
Внедрение AI, ROI кейсы, оптимизация бизнес-процессов. Через призму экономии/дохода.

```
/b2b/                               ← Hub: все B2B статьи
/b2b/[article-slug]                 ← Статья (case study, ROI analysis)
/b2b/industry/                      ← Hub: AI по индустриям
/b2b/industry/[industry-slug]       ← "How AI Saves Money in [Industry]"
/b2b/function/                      ← Hub: AI по бизнес-функциям
/b2b/function/[function-slug]       ← "AI for [Sales/Marketing/HR/etc.]"
/b2b/cases/                         ← Hub: кейсы конкретных компаний
/b2b/cases/[company-slug]           ← "[Company] AI Case Study: $X Saved"
/b2b/roi/                           ← Hub: ROI калькуляторы
/b2b/roi/[industry]-[function]      ← "AI ROI: [Function] in [Industry]"
```

**Программатический потенциал:**
- 50 industries × 25 functions = 1,250 combo pages
- 500+ company case studies
- **Итого: ~2,000+ pages**

---

### 6. /government/ — AI и государство (ОТДЕЛЬНЫЙ РАЗДЕЛ)
Госконтракты, оборона, регулирование (как барьер или помощь для заработка),
дата-центры, инфраструктура, smart cities, AI в космосе, глобальные проекты.
Всё через призму денег: госбюджеты, контракты, экономические прогнозы.

```
/government/                        ← Hub: AI и государство
/government/[article-slug]          ← Статья

/government/spending/               ← Hub: госрасходы на AI
/government/spending/[country-slug] ← "AI Government Budget: [Country] — $XXB"

/government/defense/                ← Hub: оборона и AI
/government/defense/[country-slug]  ← "AI Defense Spending: [Country]"
/government/defense/contracts/      ← Hub: крупные контракты
/government/defense/contracts/[slug] ← Конкретный контракт

/government/regulation/             ← Hub: законы (блокируют или помогают заработать?)
/government/regulation/[country-slug] ← "AI Laws in [Country]: Help or Block Your Business?"

/government/infrastructure/         ← Hub: дата-центры, энергетика, чипы
/government/infrastructure/data-centers/ ← Hub: дата-центры
/government/infrastructure/data-centers/[location-slug] ← "$XB Data Center in [Location]"
/government/infrastructure/energy/  ← Энергетика для AI (ядерная, возобновляемая)
/government/infrastructure/chips/   ← Полупроводники, экспортные ограничения

/government/smart-cities/           ← Hub: умные города
/government/smart-cities/[city-slug] ← "AI Smart City: [City] — $XB Project"

/government/space/                  ← Hub: AI в космосе
/government/space/[topic-slug]      ← NASA AI, SpaceX AI, satellite AI

/government/economy/                ← Hub: AI и экономика
/government/economy/[country-slug]  ← "AI GDP Impact: [Country] — +$XB by 2030"
/government/economy/jobs/           ← AI и рынок труда по странам
/government/economy/jobs/[country-slug]
```

**Программатический потенциал:** ~800+ pages

---

### 7. /tools/ — AI инструменты
Обзоры, цены, сравнения, альтернативы. Машинно-оптимизировано для GEO.

```
/tools/                             ← Hub: категории инструментов
/tools/[tool-slug]                  ← Обзор инструмента
/tools/compare/                     ← Hub: все сравнения
/tools/compare/[a]-vs-[b]           ← "[Tool A] vs [Tool B]"
/tools/best-for/                    ← Hub: лучшие для...
/tools/best-for/[profession-slug]   ← "Best AI Tools for [Profession]"
/tools/pricing/                     ← Hub: цены
/tools/pricing/[tool-slug]          ← "[Tool] Pricing 2026"
/tools/alternatives/                ← Hub: альтернативы
/tools/alternatives/[tool-slug]     ← "[Tool] Alternatives"
/tools/articles/                    ← Статьи-обзоры (human-written)
/tools/articles/[article-slug]
```

**Программатический потенциал:** 12,000+ pages

---

### 8. /models/ — AI модели
Лидерборды, бенчмарки, профили. Машинно-оптимизировано для GEO.

```
/models/                            ← Hub: лидерборд
/models/[model-slug]                ← Профиль модели
/models/compare/                    ← Hub: сравнения
/models/compare/[a]-vs-[b]          ← "[Model A] vs [Model B]"
/models/benchmarks/                 ← Hub: бенчмарки
/models/benchmarks/[benchmark-slug]
/models/pricing/                    ← Hub: API цены
/models/pricing/[model-slug]
```

**Программатический потенциал:** 3,000+ pages

---

### 9. /learn/ — Обучение и карьера
Курсы, сертификации, career paths. Привязка к зарплатам.

```
/learn/                             ← Hub: всё обучение
/learn/[article-slug]               ← Статья (курс, сертификация)
/learn/careers/                     ← Hub: карьера в AI
/learn/careers/[role-slug]          ← Профиль роли
/learn/careers/salaries/            ← Hub: зарплаты
/learn/careers/salaries/[role]-in-[city] ← "AI [Role] Salary in [City]"
```

**Программатический потенциал:** 1,000+ pages

---

### 10. /materials/ — Материалы для души
Книги, подкасты, YouTube, эссе. Для людей, с эмоциями.

```
/materials/                         ← Hub: все материалы
/materials/[article-slug]           ← Статья
```

---

## СВОДНАЯ ТАБЛИЦА

| Раздел | Для кого | Тип контента | Программат. страниц |
|--------|----------|-------------|-------------------|
| /news/ | Люди | Новости | 52+/год |
| /solo/ | Люди | Income reports, гайды | 200+ |
| /startups/ | Люди + машины | Profiles, funding | 10,000+ |
| /vc/ | Люди + машины | Funds, accelerators | 1,000+ |
| /b2b/ | Люди + машины | ROI cases, industry | 2,000+ |
| /government/ | Люди + машины | Spending, regulation, infra | 800+ |
| /tools/ | Машины + люди | Reviews, pricing, compare | 12,000+ |
| /models/ | Машины | Benchmarks, profiles | 3,000+ |
| /learn/ | Люди | Courses, salaries | 1,000+ |
| /materials/ | Люди | Books, podcasts | 100+ |
| **ИТОГО** | | | **~30,000+ (Phase 1)** |
| **С расширением баз** | | | **60,000-100,000** |

---

## ВНУТРЕННИЕ СВЯЗИ (Hub-and-Spoke)

1. Каждый Hub ссылается на ВСЕ дочерние страницы
2. Каждая дочерняя ссылается на свой Hub + 3-5 "соседей"
3. Автоматический блок "Related" внизу КАЖДОЙ страницы
4. Кросс-секционные ссылки (b2b → tools, startups → models)
5. Breadcrumbs на КАЖДОЙ странице: Home > Section > Subsection > Page
6. Каждая страница достижима за 3 клика от главной

---

## ПРАВИЛО ДЛЯ ПЕРЕКРЁСТНОГО КОНТЕНТА

Когда статья может жить в двух разделах:
1. Выбираем ОДИН канонический дом на основе главного intent
2. Из другого раздела ССЫЛАЕМСЯ на каноническую страницу
3. НИКОГДА не дублируем полную страницу
4. В базе данных помечаем тегами для множественной навигации

---

## SITEMAP

```
sitemap-index.xml
├── sitemap-news.xml
├── sitemap-solo.xml
├── sitemap-startups-1.xml ... sitemap-startups-N.xml (по 50K)
├── sitemap-vc.xml
├── sitemap-b2b.xml
├── sitemap-government.xml
├── sitemap-tools-1.xml ... sitemap-tools-N.xml (по 50K)
├── sitemap-models.xml
├── sitemap-learn.xml
└── sitemap-materials.xml
```

---

## ТЕХНИЧЕСКИЕ РЕШЕНИЯ

| Что | Решение |
|-----|---------|
| Рендеринг | Next.js ISR (top-500 при деплое, остальные on-demand) |
| База данных | Supabase (PostgreSQL) |
| Хостинг | Vercel |
| URL глубина | Max 3 уровня |
| Публикация | Порциями 20-30 стр/день |
| Обновление | Каждые 45 дней |
| Canonical | Self-referencing на каждой странице |
| Schema | Article + BreadcrumbList + FAQPage |
| AI crawlers | Все разрешены (GPTBot, ClaudeBot, PerplexityBot) |
