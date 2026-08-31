# Pista Studio — Site web

Version courante: **v8.6 « Ravitaillement »**. Voir `CHANGELOG.md` pour l'historique des versions.

Site vitrine bilingue (FR/EN) en HTML, CSS et JavaScript pur. Aucune dépendance, aucun outil de build.

## Ouvrir le projet dans Visual Studio Code

1. Décompresse le dossier `pista-studio` où tu veux (par exemple dans `Documents`).
2. Dans VS Code, va dans `Fichier > Ouvrir le dossier...` et choisis le dossier `pista-studio`.
3. Pour voir le site en direct, installe l'extension **Live Server** (Ritwick Dey):
   clique sur l'icône Extensions dans la barre de gauche, cherche « Live Server », installe.
4. Clic droit sur `index.html` puis « Open with Live Server ». Le site s'ouvre dans ton navigateur et se rafraîchit à chaque sauvegarde.

Sans Live Server, tu peux aussi simplement double-cliquer `index.html` dans le Finder.

### Servir le site sur localhost:3000

Dans le terminal de VS Code (menu `Terminal > New Terminal`), depuis le dossier du site:

```
npx serve -l 3000
```

Puis ouvre http://localhost:3000 dans ton navigateur. Pour arrêter le serveur, Ctrl+C dans le terminal.

## Structure du projet

```
pista-studio/
├── index.html          Redirection selon la langue du navigateur
├── fr/                 Pages françaises
│   ├── index.html      Accueil
│   ├── services.html
│   ├── realisations.html
│   ├── a-propos.html
│   └── contact.html
├── en/                 Pages anglaises
│   ├── index.html      Home
│   ├── services.html
│   ├── work.html
│   ├── about.html
│   └── contact.html
├── css/style.css       Tout le design (couleurs, typographie, grilles)
├── js/main.js          Menu mobile, animations, formulaire
└── assets/favicon.svg  Le point signature
```

## Personnaliser

- **Couleurs et typographie**: tout est dans `css/style.css`, section `:root` en haut du fichier.
- **Textes**: chaque page est un fichier HTML indépendant. Les descriptions de clients dans `realisations.html` et `work.html` sont des textes de démonstration à remplacer par tes vrais mandats.
- **Photos**: dépose tes images dans `assets/` et insère-les avec `<img src="../assets/mon-image.jpg" alt="Description">`.
- **Formulaire de contact**: il est en mode démonstration. Pour recevoir les messages par courriel, crée un compte gratuit sur [Formspree](https://formspree.io), puis remplace la balise `<form ...>` par `<form action="https://formspree.io/f/TON_CODE" method="POST">` dans `fr/contact.html` et `en/contact.html`.

## Pousser sur GitHub

Le dépôt est `pista-studio-marketing/pista-website`. Dans le terminal de VS Code (menu `Terminal > New Terminal`), depuis le dossier `pista-studio`:

```
git init
git add .
git commit -m "Site Pista Studio, normes graphiques v2"
git branch -M main
git remote add origin https://github.com/pista-studio-marketing/pista-website.git
git push -u origin main
```

## Mettre en ligne

Le site est 100 % statique, tu peux l'héberger gratuitement:

- **GitHub Pages**: dans le dépôt, va dans `Settings > Pages`, choisis la branche `main` et le dossier racine. Le site sera en ligne en quelques minutes.
- **Netlify** ou **Cloudflare Pages** fonctionnent aussi très bien, et tu pourras y connecter ton domaine `pista.ca`.

Bonne route.
