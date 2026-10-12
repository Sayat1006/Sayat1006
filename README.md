# S-AI — Мұғалімге арналған AI жұмыс кеңістігі

Next.js негізіндегі лендинг-сайт. Статикалық сайт ретінде экспортталады (`output: "export"`) және GitHub Pages-ке автоматты түрде жарияланады.

## Жергілікті іске қосу

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # статикалық сайт `out/` қалтасына жиналады
```

## Жариялау (GitHub Pages)

1. GitHub репозиторийінде **Settings → Pages → Build and deployment → Source** бөлімінен **GitHub Actions** таңдаңыз.
2. `main` тармағына push жасалған сайын `.github/workflows/deploy.yml` сайтты жинап, жариялайды.
3. Сайт мекенжайы: `https://sayat1006.github.io/Sayat1006/`

Сайтты басқа хостингке (Vercel, Netlify т.б.) түбірлік мекенжаймен орналастырсаңыз, `NEXT_PUBLIC_BASE_PATH` айнымалысын бос қалдырыңыз.
