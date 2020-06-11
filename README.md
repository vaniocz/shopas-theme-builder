# Shopas - Nástroj na vytváření vzhledů

Pomocí tohoto nástroje můžete vytvořit libovolný vzhled pro svůj e-shop
na [Shopasu](https://www.shopas.cz/).

Užitečné příkazy:

- `npm install` - nainstaluje všechny závislosti
- `npm start` - spustí webpack-dev-server
- `npm run build` - vybuilduje vzhled

Výsledný ZIP archiv najdete po vybuildění ve složce `build/shopas_theme.zip`.
Tento archiv lze použít na Shopasu v nastavení vzhledu e-shopu.

Po spuštění příkazu `npm start` se spustí vývojový server, který zobrazí statický ukázkový
e-shop. V tomto e-shopu je vidět maximum možných prvků, které se na e-shopu mohou objevit.

Úpravu vzhledu můžete provést editací stylů ve složce `src/styles`, kde jsou jednotlivé části
e-shopu nastylovány podle logických celků v [SASSu](https://sass-lang.com/).

Úpravu vzhledu změnou podkladového HTML v šablonách Shopas zatím neumí. Proto tyto **šablony
neměňte**, jejich změna se do e-shopu v tuto chvíli nepromítne. Podkladové šablony jsou napsané
ve [twigu](https://twig.symfony.com/).

Kromě stylů můžete upravit také favicony ve složce `src/favicon`, fonty ve složce `src/fonts`
a obrázky ve složce `src/images`. Tyto úpravy se při buildu promítnou do výsledného archivu
a na e-shopu se použijí.
