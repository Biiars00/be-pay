# Payment API

API responsável por processar compras utilizando **múltiplos gateways de pagamento**, com fallback automático em caso de falha.

O sistema calcula o valor total dos produtos, tenta processar o pagamento em um gateway e, caso ocorra erro, tenta automaticamente no próximo gateway disponível.

# Tecnologias utilizadas

* Node.js
* TypeScript
* AdonisJS
* MySQL
* Docker
* Axios
* Japa

# Arquitetura

O projeto segue uma arquitetura em camadas para garantir separação de responsabilidades e melhor manutenção do código.

```
app
 ├ controllers
 ├ factories
 ├ gateways
 ├ interfaces
 ├ models
 ├ repositories
 ├ services
 └ validators
```

### Camadas principais

**Controller**

* recebe requisições HTTP
* valida os dados
* chama os serviços

**Factory**

* Responsável por instanciar o gateway correto baseado na configuração do banco.

**Gateways**

* implementações de integração com APIs externas de pagamento

#### Models
Representam as entidades persistidas no banco de dados.

**Repository**

* responsável pelo acesso ao banco de dados

**Service**

* contém a regra de negócio
* processa pagamentos
* gerencia fallback de gateways

# Estrutura do Projeto

```
app
├── controllers
│ └── payment_controller.ts
│
├── services
│ ├── payment_service.ts
│ └── gateway_service.ts
│
├── gateways
│ ├── gateway1.ts
│ └── gateway2.ts
│
├── factories
│ └── gateway_factory.ts
│
├── repositories
│ └── transaction_repository.ts
│
├── models
│ ├── transaction_model.ts
│ ├── product_model.ts
│ ├── gateway_model.ts
│ └── transaction_product_model.ts
│
└── interfaces
  ├── gateway_interface.ts
  └── payment_interface.ts

database
├── migrations
└── seeders
```

# Requisitos

Antes de rodar o projeto é necessário ter instalado:

* Node.js
* Docker
* Docker Compose
* MySQL (caso rode sem docker)

# Variáveis de ambiente

* Copie o arquivo `.env`:

```
cp .env.example .env
```

* Principais variáveis:

```
DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=

GATEWAY1_URL=
EMAIL_AUTHENTICATE=
TOKEN_AUTHENTICATE=

GATEWAY2_URL=
GATEWAY_AUTH_TOKEN=
GATEWAY_AUTH_SECRET=
```

# Instalação do Projeto

## 1. Clonar o repositório

```
git clone https://github.com/Biiars00/be-pay
```

## 2. Rodar o projeto 

O projeto possui um **docker-compose** que sobe automaticamente:

* banco de dados MySQL
* API
* gateways de pagamento simulados

```
docker compose up --build
```

Isso iniciará os seguintes serviços:

| Serviço   | Porta |
| --------- | ----- |
| API       | 3333  |
| Gateway 1 | 3001  |
| Gateway 2 | 3002  |
| MySQL     | 3306  |

Se preferir rodar **manualmente**, siga esse passo a passo:

* Instale as dependências: `npm install`

* Rodar gateways externos: `docker run -p 3001:3001 -p 3002:3002 matheusprotzen/gateways-mock`

* Confirguração do Banco de Dados

  - Executar migrations: `node ace migration:run`

  - Popular banco com dados iniciais: `node ace db:seed`

* Executar a API: `node ace serve --watch` OU `npm run dev`

Após iniciar, a API estará disponível em:

```
http://localhost:3333
```

# Endpoints

**GATEWAY 1**
---

- **Login**

**POST** /login

Body:
```
{
   "email": "dev@betalent.tech",
   "token": "FEC9BB078BF338F464F96B48089EB498"
}
```

Response:

```
{
  "token": "xxxxxx"
}
```

> OBS: Autenticação das seguintes rotas deve ser feito usando o **Bearer token** retornado da rota de login.
> 
> Headers:
> 
> ```
> Authorization: Bearer xxxx
> ```

- **Listagem das transações**

**GET** /transactions

Response:

```
{
    "data": [
        {
          "id": "d0430b80-0204-4c93-9e25-3af003d08f2d",
          "name": "tester",
          "email": "tester@email.com",
          "status": "paid",
          "card_first_digits": "5569",
          "card_last_digits": "6063",
          "amount": 1000
        }
    ]
}
```

- **Criação de uma transação**

**POST** /transactions

Body:

```
{
  "amount": 1000,
  "name": "tester",
  "email": "tester@email.com",
  "cardNumber": "5569000000006063",
  "cvv": "010"
}
```

Response:

```
{
  "id": "d0430b80-0204-4c93-9e25-3af003d08f2d"
}
```

- **Reembolso de uma transação**

**POST** /transactions/:id/charge_back

- :id: **id da transação**

Response:

```
{
    "id": "d0430b80-0204-4c93-9e25-3af003d08f2d",
    "name": "tester",
    "email": "tester@email.com",
    "status": "charged_back",
    "card_first_digits": "5569",
    "card_last_digits": "6063",
    "amount": 1000
}
```

**GATEWAY 2**
---

Headers:
```
Gateway-Auth-Token: tk_f2198cc671b5289fa856
Gateway-Auth-Secret: 3d15e8ed6131446ea7e3456728b1211f
```

- **Listagem das transações**

**GET** /transacoes

Response:

```
{
    "data": [
        {
            "id": "146c87a2-c5b1-4be3-a03b-aef657b07abf",
            "name": "tester",
            "email": "tester@email.com",
            "status": "paid",
            "card_first_digits": "5569",
            "card_last_digits": "6063",
            "amount": 1000
        }
    ]
}
```

- **Criação de uma transação**

**POST** /transacoes

Body:

```
{
    "valor": 1000,
    "nome": "tester",
    "email": "tester@email.com",
    "numeroCartao": "5569000000006063",
    "cvv": "010"
}
```

Response:

```
{
    "id": "146c87a2-c5b1-4be3-a03b-aef657b07abf"
}
```

- **Reembolso de uma transação**

**POST** /transacoes/reembolso

Body:

```
{
    "id": "146c87a2-c5b1-4be3-a03b-aef657b07abf"
}
```

- **Criar Compra**

**POST** /purchase

Body:

```
{
  "name": "tester",
  "email": "tester@email.com",
  "cardNumber": "5569000000006063",
  "cvv": "010",
  "products": [
    {
      "product_id": 1,
      "quantity": 1
    }
  ]
}
```

Response:

```
{
    "clientName": "tester",
    "clientEmail": "tester@email.com",
    "gatewayId": 1,
    "externalId": "a6ea8886-ac7d-4a38-8a1c-ac4092d4965d",
    "amount": 350000,
    "status": "success",
    "cardLastNumbers": "6063",
    "createdAt": "2026-03-16T00:27:27.093+00:00",
    "updatedAt": "2026-03-16T00:27:27.093+00:00",
    "id": 1
}
```

## Fluxo da compra

1. Recebe dados da requisição
2. Valida dados de entrada
3. Calcula o valor total dos produtos
4. Busca gateways ativos no banco
5. Tenta processar pagamento no primeiro gateway
6. Caso falhe, tenta o próximo gateway
7. Registra a transação no banco
8. Associa os produtos à transação

# Estrutura do Banco de Dados

## products

| campo      | tipo      |
| ---------- | --------- |
| id         | integer   |
| name       | string    |
| amount     | integer   |
| created_at | timestamp |
| updated_at | timestamp |

## gateways

| campo      | tipo      |
| ---------- | --------- |
| id         | integer   |
| name       | string    |
| is_active  | boolean   |
| priority   | integer   |
| created_at | timestamp |
| updated_at | timestamp |

## transactions

| campo             | tipo      |
| ----------------- | --------- |
| id                | integer   |
| client_name       | string    |
| client_email      | string    |
| gateway_id        | integer   |
| external_id       | string    |
| amount            | integer   |
| status            | string    |
| card_last_numbers | string    |
| created_at        | timestamp |
| updated_at        | timestamp |

## transaction_products

| campo          | tipo    |
| -------------- | ------- |
| id             | integer |
| transaction_id | integer |
| product_id     | integer |
| quantity       | integer |

# Gateways de Pagamento

O sistema suporta múltipos gateways.

# Fallback de Gateway

Os gateways são buscados no banco e ordenados por prioridade.

Exemplo:

| gateway  | priority |
| -------- | -------- |
| gateway1 | 1        |
| gateway2 | 2        |

Fluxo:

```
Gateway1
   ↓ falha
Gateway2
   ↓ sucesso
```

# Testes

Os testes unitários foram implementados utilizando **Japa**.

As dependências externas são **mockadas**, garantindo testes rápidos e isolados.

Executar testes:

`node ace test` OU `npm run test`

# Possíveis melhorias

- Retry automático de gateways
- Timeout de gateway
- Circuit breaker
- Logs estruturados
- Idempotência de pagamento

# Considerações finais

O projeto foi desenvolvido priorizando:

* separação de responsabilidades
* código legível
* facilidade de manutenção
* testes unitários isolados
* fallback automático entre gateways
* ambiente reproduzível com Docker

A arquitetura permite adicionar facilmente novos gateways de pagamento no futuro.

# Autor
### [Beatriz Ribeiro](https://github.com/Biiars00)



