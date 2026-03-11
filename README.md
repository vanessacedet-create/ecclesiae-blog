# Blog da Editora Ecclesiae

Blog profissional desenvolvido com **Next.js**, **Tailwind CSS** e **Markdown**.

---

## 🚀 Como Publicar no Ar (Vercel + GitHub)

### Passo 1: Colocar no GitHub

1. Acesse [github.com](https://github.com) e crie um novo repositório chamado `ecclesiae-blog`
2. Abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Primeiro commit: blog da Editora Ecclesiae"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/ecclesiae-blog.git
git push -u origin main
```

### Passo 2: Publicar na Vercel (hospedagem gratuita)

1. Acesse [vercel.com](https://vercel.com) e crie uma conta gratuita (pode entrar com o GitHub)
2. Clique em **"Add New Project"**
3. Selecione o repositório `ecclesiae-blog`
4. Clique em **"Deploy"** — é só isso!

A Vercel vai detectar automaticamente que é um projeto Next.js e configurar tudo.

Em ~2 minutos seu blog estará no ar em um endereço como:
`https://ecclesiae-blog.vercel.app`

### Passo 3: Domínio personalizado (opcional)

Na Vercel, vá em **Settings → Domains** e adicione `blog.editoraecclesiae.com.br` (ou o domínio que preferir).

---

## ✍️ Como Escrever um Novo Post

1. Crie um arquivo `.md` na pasta `posts/`, por exemplo: `posts/novo-artigo.md`
2. Use este modelo no topo do arquivo:

```markdown
---
title: "Título do Artigo"
date: "2025-03-20"
category: "Liturgia"
author: "Nome do Autor"
excerpt: "Um resumo curto do artigo que aparece na listagem."
---

Seu texto começa aqui...

## Subtítulo

Mais parágrafo aqui.

> Citação em destaque
```

3. Salve o arquivo
4. Execute no terminal:

```bash
git add .
git commit -m "Novo post: Título do Artigo"
git push
```

O site atualiza automaticamente em segundos! ✨

---

## 📁 Estrutura do Projeto

```
ecclesiae-blog/
├── posts/              ← Aqui ficam seus artigos (.md)
├── pages/
│   ├── index.js        ← Página inicial
│   ├── sobre.js        ← Página "Sobre"
│   └── posts/[id].js   ← Template de cada post
├── components/
│   ├── Layout.js       ← Estrutura geral (cabeçalho + rodapé)
│   ├── Header.js       ← Cabeçalho
│   ├── Footer.js       ← Rodapé
│   └── PostCard.js     ← Card de artigo
├── styles/
│   └── globals.css     ← Estilos globais
└── lib/
    └── posts.js        ← Lógica de leitura dos posts
```

---

## 🛠️ Rodar Localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 📋 Categorias Sugeridas

- `Liturgia`
- `Teologia`
- `Espiritualidade`
- `Santos`
- `Filosofia`
- `Cultura`
- `Vida Cristã`

---

## ✠ Ad Maiorem Dei Gloriam
