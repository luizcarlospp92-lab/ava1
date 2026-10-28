# ava1 — Contador de Cafés ☕

Aplicação com backend em **Node.js + Express**, que inclui uma feature simples de contador de cafés. O projeto foi estruturado com práticas DevOps: fluxo de branches, Pull Requests, Conventional Commits e pipeline de CI com testes automatizados.

## Sumário

- [Tecnologias e versões](#tecnologias-e-versões)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [API do contador](#api-do-contador)
- [Testes](#testes)
- [Pipeline de CI](#pipeline-de-ci)
- [Fluxo de trabalho Git](#fluxo-de-trabalho-git)

## Tecnologias e versões

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 20 (LTS) no pipeline de CI; 22 também validado localmente | Runtime |
| npm | 10.x | Gerenciador de pacotes |
| [Express](https://expressjs.com/) | 4.22.3 (`^4.19.2`) | Framework web / rotas HTTP |
| [Jest](https://jestjs.io/) | 29.7.0 (`^29.7.0`) | Testes unitários e de integração, cobertura |
| [Supertest](https://github.com/ladjs/supertest) | 7.3.1 (`^7.0.0`) | Chamadas HTTP nos testes de integração |
| [commitlint](https://commitlint.js.org/) + config-conventional | 19.x | Validação de Conventional Commits no CI |
| GitHub Actions | `checkout@v4`, `setup-node@v4`, `upload-artifact@v4` | Pipeline de CI |

> A coluna "Versão" mostra o que foi instalado e testado; o valor entre parênteses é o intervalo declarado no `package.json`. O `package-lock.json` trava as versões exatas, e o pipeline usa `npm ci` para reproduzir o mesmo ambiente.

## Estrutura do projeto

```
.
├── .github/
│   ├── workflows/ci.yml            # Pipeline (build, testes, cobertura, commitlint)
│   └── pull_request_template.md    # Checklist de Pull Request
├── backend/
│   ├── src/coffee/
│   │   ├── coffeeService.js        # Regra de negócio do contador
│   │   └── coffeeRouter.js         # Rotas Express
│   ├── tests/
│   │   ├── unit/                   # Testes unitários
│   │   └── integration/            # Testes de integração
│   ├── scripts/build.js            # Gera backend/dist
│   └── package.json
├── frontend/src/coffeeCounter.js   # Exemplo de consumo da API (JS puro)
├── commitlint.config.js
├── CONTRIBUTING.md                 # Branches, commits e fluxo de PR
└── README.md
```

## Como executar

Pré-requisitos: Node.js 20 ou superior e npm.

```bash
cd backend
npm ci            # instala as dependências conforme o package-lock.json
npm run build     # gera backend/dist
```

Para ativar a feature no servidor Express já existente, registre a rota:

```js
const express = require('express');
const { createCoffeeRouter } = require('./coffee/coffeeRouter');

const app = express();
app.use(express.json());
app.use('/api/coffee', createCoffeeRouter());
```

## API do contador

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| `GET` | `/api/coffee` | — | `200` `{ "count": 0 }` |
| `POST` | `/api/coffee` | opcional `{ "cups": 2 }` (padrão 1) | `201` `{ "count": 2 }` |
| `POST` | `/api/coffee` | `cups` inválido (≤ 0, decimal, texto) | `400` `{ "error": "..." }` |
| `DELETE` | `/api/coffee` | — | `200` `{ "count": 0 }` |

Exemplo:

```bash
curl -X POST http://localhost:3000/api/coffee -H "Content-Type: application/json" -d '{"cups": 2}'
curl http://localhost:3000/api/coffee
```

**Observação:** o contador é mantido em memória e zera quando o servidor reinicia.

## Testes

```bash
cd backend
npm run test:unit          # testes unitários
npm run test:integration   # testes de integração
npm test                   # todos, com relatório de cobertura em backend/coverage
```

Resultado atual: 11 testes unitários e 5 de integração, todos passando.

**Na seção "API"**, depois da rota de saudação:

````markdown
### `GET /api/coffee`

Retorna o total de cafés servidos. Resposta `200`:

```json
{ "count": 3 }
```

### `POST /api/coffee`

Soma cafés ao contador. Corpo opcional (padrão: 1 café):

```json
{ "cups": 2 }
```

Resposta `201`: `{ "count": 5 }`.
Resposta `400` (`cups` não é inteiro >= 1): `{ "error": "cups deve ser um inteiro >= 1" }`.

### `DELETE /api/coffee`

Zera o contador. Resposta `200`: `{ "count": 0 }`.

> O contador fica em memória e é global; reiniciar o servidor volta o valor para 0.
````

**Na tabela da seção "Testes"**, acrescente ao que cada tipo cobre:

````markdown
| Unitários | `tests/unit` | ... e o serviço do contador de cafés (`coffeeService`) |
| Integração | `tests/integration` | ... e as rotas `/api/coffee` |
````

**Na seção "Estrutura do repositório"**, dentro de `backend/src/`:

````markdown
│   │   └── coffee/
│   │       ├── coffeeService.js   # regras do contador de cafés
│   │       └── coffeeRouter.js    # rotas /api/coffee
````

## Pipeline de CI

Arquivo: `.github/workflows/ci.yml`, executado em push e Pull Request para `main`, `master` e `develop`.

| Stage | Job | Steps principais | Artefato |
|---|---|---|---|
| 1. Build | `build` | checkout, setup Node 20, `npm ci`, `npm run build` | `backend-dist` |
| 2. Testes | `unit-tests` | `npm run test:unit` | — |
| 2. Testes | `integration-tests` | `npm run test:integration` | — |
| 3. Relatório | `coverage` | `npm test` | `coverage-report` |
| Qualidade | `commit-lint` (só em PR) | valida Conventional Commits | — |

Os jobs de teste só iniciam após o build (`needs: build`) e rodam em paralelo; a cobertura só roda se ambos passarem.

## Fluxo de trabalho Git

- Branches: `main` (estável), `develop` (integração), `feature/*` e `fix/*`.
- Nenhum push direto em `main` ou `develop`; toda mudança entra por Pull Request com CI verde e ao menos uma aprovação.
- Commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `feat(coffee): adiciona contador de cafés`.

Detalhes completos em [CONTRIBUTING.md](CONTRIBUTING.md).
