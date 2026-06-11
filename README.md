# PASTA — Planer Studenta

Aplikacja webowa dla studentów: plan zajęć, przedmioty, oceny, wydarzenia, frekwencja i historia semestrów. Frontend w
**SvelteKit**, dane w **MySQL**.

## Wymagania

- **Node.js** 22+ (lokalny development)
- **npm** lub **pnpm** (w repozytorium są oba lockfile’y; Docker buduje aplikację przez pnpm)
- **Docker** i **Docker Compose** (najprostszy sposób uruchomienia bazy danych i całej aplikacji)

## Przygotowanie projektu

### 1. Pobierz repozytorium

```sh
git clone https://github.com/ndelta0/PSBD_Pasta.git
cd PSBD_Pasta
```

### 2. Skonfiguruj bazę danych

#### Opcja A: Docker (zalecane)

Baza startuje automatycznie i wykonuje skrypty z katalogu `sql/`:

- `0-initialize.sql` — schemat bazy
- `1-seed-demo.sql` — dane demonstracyjne

```sh
docker compose up db -d
```

Przy **pierwszym** uruchomieniu kontener utworzy bazę `pasta_db` i użytkownika `pasta_user`. Jeśli chcesz zresetować
dane, usuń wolumen:

```sh
docker compose down -v
docker compose up db -d
```

#### Opcja B: własna instalacja MySQL

1. Uruchom serwer MySQL 8.x.
2. Wykonaj skrypty z katalogu `sql/` (w tej kolejności).
3. Utwórz użytkownika z dostępem do bazy `pasta_db` albo dostosuj dane logowania w `.env`.

### 3. Utwórz plik `.env`

Skopiuj przykładową konfigurację:

```sh
cp .env.example .env
```

Domyślne wartości (zgodne z `docker-compose.yml`):

```env
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="pasta_user"
DATABASE_PASSWORD="pasta_password"
DATABASE_NAME="pasta_db"
```

## Instalacja zależności

```sh
npm install
```

Alternatywnie:

```sh
pnpm install
```

## Uruchamianie

### Development (zalecane do pracy nad kodem)

Upewnij się, że baza danych działa (np. `docker compose up db -d`), potem:

```sh
npm run dev
```

Aplikacja będzie dostępna pod adresem **http://localhost:5173** (domyślny port Vite).

Aby otworzyć przeglądarkę automatycznie:

```sh
npm run dev -- --open
```

### Produkcja lokalnie

```sh
npm run build
npm run preview
```

### Cała aplikacja w Dockerze

Uruchamia bazę i zbudowaną aplikację Node:

```sh
docker compose up --build
```

Aplikacja będzie dostępna pod adresem **http://localhost:3000**.

## Korzystanie z aplikacji

### Logowanie i rejestracja

1. Wejdź na stronę logowania (`/login`).
2. Zaloguj się istniejącym kontem albo załóż nowe konto (`/register`).
3. Po zalogowaniu trafiasz do panelu głównego.

**Konto demonstracyjne** (z seedu bazy):

| Pole   | Wartość                    |
|--------|----------------------------|
| E-mail | `jan.kowalski@example.com` |
| Hasło  | `test1234`                 |

### Nawigacja

Po zalogowaniu w panelu bocznym dostępne są sekcje:

| Sekcja     | Ścieżka       | Opis                                     |
|------------|---------------|------------------------------------------|
| Dashboard  | `/`           | Podsumowanie: zajęcia, oceny, frekwencja |
| Plan zajęć | `/schedule`   | Tygodniowy plan                          |
| Przedmioty | `/subjects`   | Szczegóły przedmiotów                    |
| Oceny      | `/grades`     | Oceny wg przedmiotów i średnia           |
| Wydarzenia | `/events`     | Nadchodzące terminy                      |
| Frekwencja | `/attendance` | Obecności                                |
| Historia   | `/history`    | Archiwum semestrów                       |
| Profil     | `/profile`    | Dane konta i wylogowanie                 |

### Dodawanie danych

W sekcjach **Oceny** i **Wydarzenia** przycisk **„Dodaj…”** otwiera formularz. Po zapisie dane trafiają do bazy MySQL i
lista odświeża się automatycznie.

- **Oceny** — przedmiot, nazwa oceny, wartość (1–5), data, waga.
- **Wydarzenia** — tytuł, przedmiot, typ, data, godzina, opis.

Nowy przedmiot wpisany w formularzu zostanie utworzony w bazie (powiązany z bieżącym semestrem).

## Przydatne komendy

| Komenda           | Opis                             |
|-------------------|----------------------------------|
| `npm run dev`     | Serwer developerski              |
| `npm run build`   | Build produkcyjny                |
| `npm run preview` | Podgląd buildu                   |
| `npm run check`   | Sprawdzenie typów (svelte-check) |
| `npm run lint`    | ESLint + Prettier                |
| `npm run format`  | Formatowanie kodu                |

## Struktura projektu

```
sql/                  Skrypty inicjalizacji i seedu bazy
src/
  routes/             Strony SvelteKit (app + auth)
  lib/
    components/       Komponenty UI
    server/           Połączenie z bazą, autentykacja
docker-compose.yml    Baza MySQL + aplikacja produkcyjna
Dockerfile            Build obrazu aplikacji
```

## Stack technologiczny

- [SvelteKit](https://kit.svelte.dev/) + [Svelte 5](https://svelte.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MySQL 8](https://www.mysql.com/) (`mysql2`)
- [Argon2](https://github.com/ranisalt/node-argon2) — hashowanie haseł
- [@sveltejs/adapter-node](https://svelte.dev/docs/kit/adapter-node) — deploy Node.js