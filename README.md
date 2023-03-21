<!-- PROJECT SHIELDS -->
<!-- ... -->

<!--
*** Estamos usando "reference style" do markdown para links por legibilidade.
*** Os links de referência são usados entre chaves [ ] ao invés de parênteses ( ).
*** @see https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- RESUMO -->
<br />
<p align="center">
  <h1 align="center">Pokecenter de Pallet Town</h1>
  <br />

  <p align="center">
    <a href="http://localhost:8080/">
      <strong>Ver a documentação da API (localhost required) »</strong>
    </a>
  </p>
</p>

## 🚀 Como usar

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 🔧 Instalando

Precisamos de algumas etapas para configurar o projeto.

Instale as dependências do projeto

```
yarn
# or
yarn install
```

Em seguida configure as variáveis de ambiente baseadas no `.env.example` da raiz do projeto e de dentro da ms-gateway

### Seed 

```
DATABASE_URL="mongodb+srv://username:password@cluster0.n6c0y.mongodb.net/database?retryWrites=true&w=majority"
```

### ms-gateway

```
API_PORT=8080
```

Para executar a aplicação execute

```
yarn ms-getaway
```

Acesse seu `http://localhost:8080/` para tera acesso aos endpoints da aplicação.

<img src="./docs/assets/home.png" alt="Logo" height="auto" style="max-width: 100%" />

### ⚙️ Executando os testes

```
yarn test
```