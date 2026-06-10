insert into pasta_db.users (id, email, passwordHash, name, surname, groupName)
values (1, 'jan.kowalski@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$kOiOZT4tlotWbHC8P6umCg$rP7cPCm7Y52Tr5G4UoYXZQdWdpL8yaPNsUtQBR7Utqs', 'Jan',
        'Kowalski', 'IPIPM-161');


insert into pasta_db.class_types (id, label)
values (3, 'Ćwiczenia'),
       (2, 'Laboratorium'),
       (4, 'Projekt'),
       (5, 'Seminarium'),
       (1, 'Wykład');


insert into pasta_db.schedule_entries (id, userId, subjectId, dayOfWeek, startsAt, endsAt, classTypeId, location,
                                       teacherName)
values
    -- current semester
    (1, 1, 1, 'Monday', '08:15:00', '10:00:00', 1, 's. 308', 'dr hab. Jan Kowalski'),
    (2, 1, 2, 'Monday', '10:15:00', '12:00:00', 3, 's. 011', 'mgr Anna Nowak'),
    (3, 1, 3, 'Tuesday', '08:15:00', '10:00:00', 1, 's. 402', 'mgr Michał Dąbrowski'),
    (4, 1, 2, 'Wednesday', '13:15:00', '15:00:00', 1, 's. 011', 'prof. dr hab. Katarzyna Wiśniewska'),
    (5, 1, 1, 'Thursday', '10:15:00', '12:00:00', 2, 's. 316', 'mgr Anna Nowak'),
    (6, 1, 3, 'Friday', '13:15:00', '14:00:00', 4, 's. 720', 'dr Piotr Wiśniewski'),
    (7, 1, 4, 'Monday', '12:15:00', '14:00:00', 1, 's. 204', 'dr inż. Tomasz Lewandowski'),
    (8, 1, 5, 'Tuesday', '10:15:00', '12:00:00', 2, 's. 118', 'mgr inż. Paulina Kaczmarek'),
    (9, 1, 6, 'Wednesday', '08:15:00', '10:00:00', 5, 's. 401', 'dr hab. Andrzej Maj'),
    (10, 1, 7, 'Thursday', '14:15:00', '16:00:00', 3, 's. 220', 'mgr Piotr Nowicki'),
    (11, 1, 8, 'Friday', '10:15:00', '11:45:00', 5, 's. 12A', 'lektor Anna Zielińska'),

    -- archived/past semesters
    (12, 1, 9, 'Monday', '08:15:00', '10:00:00', 1, 's. 310', 'dr hab. Jan Kowalski'),
    (13, 1, 10, 'Tuesday', '12:15:00', '14:00:00', 1, 's. 111', 'prof. dr hab. Katarzyna Zielińska'),
    (14, 1, 11, 'Wednesday', '10:15:00', '12:00:00', 2, 's. 016', 'mgr Michał Dąbrowski'),
    (15, 1, 12, 'Thursday', '08:15:00', '10:00:00', 4, 's. 500', 'dr Piotr Wiśniewski'),
    (16, 1, 13, 'Friday', '08:15:00', '10:00:00', 1, 's. 207', 'dr hab. Jan Kowalski'),
    (17, 1, 14, 'Monday', '10:15:00', '12:00:00', 1, 's. 305', 'prof. dr hab. Katarzyna Zielińska'),
    (18, 1, 15, 'Wednesday', '13:15:00', '15:00:00', 2, 'laboratorium 2', 'mgr inż. Łukasz Wrona'),
    (19, 1, 16, 'Friday', '12:15:00', '14:00:00', 3, 'hala sportowa', 'mgr Ewa Król'),
    (20, 1, 17, 'Tuesday', '08:15:00', '10:00:00', 1, 's. 101', 'dr hab. Jan Kowalski'),
    (21, 1, 18, 'Wednesday', '08:15:00', '10:00:00', 1, 's. 102', 'prof. dr hab. Maria Mazur'),
    (22, 1, 19, 'Thursday', '10:15:00', '12:00:00', 2, 's. 203', 'dr inż. Tomasz Lewandowski'),
    (23, 1, 20, 'Friday', '14:15:00', '16:00:00', 5, 's. 14B', 'lektor Anna Zielińska');


insert into pasta_db.semesters (id, userId, name, startsOn, endsOn, isCurrent)
values (1, 1, 'Semestr zimowy 2024/2025', '2024-10-01', '2025-02-20', 0),
       (2, 1, 'Semestr letni 2024/2025', '2025-02-21', '2025-06-30', 0),
       (3, 1, 'Semestr zimowy 2025/2026', '2025-10-01', '2026-02-22', 0),
       (4, 1, 'Semestr letni 2025/2026', '2026-02-23', '2026-06-30', 1);


insert into pasta_db.subjects (id, userId, semesterId, name, code, description, ects, coordinatorName, coordinatorEmail,
                               presenceMandatory, archived, finalGrade)
values
    -- current semester
    (1, 1, 4, 'Programowanie obiektowe', 'PROG', 'Podstawy programowania obiektowego w C++', 6,
     'dr hab. Jan Kowalski', 'j.kowalski@uniwersytet.edu.pl', 1, 0, NULL),
    (2, 1, 4, 'Matematyka', 'MAT', null, 15, 'prof. dr hab. Katarzyna Zielińska', 'k.zielinska@uniwersytet.edu.pl',
     1, 0, NULL),
    (3, 1, 4, 'Systemy operacyjne', 'SOP', 'Architektura systemów operacyjnych, zarządzanie procesami i pamięcią', 2,
     'mgr Michał Dąbrowski', 'm.dabrowski@uniwersytet.edu.pl', 0, 0, NULL),
    (4, 1, 4, 'Algorytmy i struktury danych', 'AISD',
     'Złożoność obliczeniowa, klasyczne struktury danych i ich zastosowania', 6, 'dr inż. Tomasz Lewandowski',
     't.lewandowski@uniwersytet.edu.pl', 1, 0, NULL),
    (5, 1, 4, 'Bazy danych', 'BD', 'Model relacyjny, SQL, projektowanie schematów i integracja z aplikacją', 5,
     'mgr inż. Paulina Kaczmarek', 'p.kaczmarek@uniwersytet.edu.pl', 1, 0, NULL),
    (6, 1, 4, 'Inżynieria oprogramowania', 'IO',
     'Procesy wytwarzania oprogramowania, testy, dokumentacja i analiza wymagań', 4, 'dr hab. Andrzej Maj',
     'a.maj@uniwersytet.edu.pl', 1, 0, NULL),
    (7, 1, 4, 'Sieci komputerowe', 'SK', 'Warstwy sieciowe, protokoły i konfiguracja usług sieciowych', 4,
     'mgr Piotr Nowicki', 'p.nowicki@uniwersytet.edu.pl', 0, 0, NULL),
    (8, 1, 4, 'Język angielski techniczny', 'JAT',
     'Słownictwo branżowe, prezentacje i czytanie dokumentacji technicznej', 2, 'lektor Anna Zielińska',
     'a.zielinska@uniwersytet.edu.pl', 0, 0, NULL),

    -- past semester 2025/2026 winter
    (9, 1, 3, 'Programowanie obiektowe II', 'PROG2',
     'Dziedziczenie, polimorfizm, wzorce projektowe i refaktoryzacja', 5, 'dr hab. Jan Kowalski',
     'j.kowalski@uniwersytet.edu.pl', 1, 1, 4.50),
    (10, 1, 3, 'Matematyka dyskretna', 'MD', 'Logika, kombinatoryka, grafy i relacje', 5,
     'prof. dr hab. Katarzyna Zielińska', 'k.zielinska@uniwersytet.edu.pl', 1, 1, 4.00),
    (11, 1, 3, 'Systemy operacyjne II', 'SOP2', 'Wątki, synchronizacja, system plików i pamięć wirtualna', 4,
     'mgr Michał Dąbrowski', 'm.dabrowski@uniwersytet.edu.pl', 1, 1, 5.00),
    (12, 1, 3, 'Grafika komputerowa', 'GK', 'Modele 2D/3D, pipeline renderingu i podstawy shaderów', 3,
     'dr Piotr Wiśniewski', 'p.wisniewski@uniwersytet.edu.pl', 0, 1, 4.00),

    -- past semester 2024/2025 summer
    (13, 1, 2, 'Podstawy programowania', 'PP', 'Wprowadzenie do programowania i algorytmicznego myślenia', 6,
     'dr hab. Jan Kowalski', 'j.kowalski@uniwersytet.edu.pl', 1, 1, 5.00),
    (14, 1, 2, 'Matematyka I', 'MAT1', 'Analiza matematyczna, ciągi, pochodne i całki', 8,
     'prof. dr hab. Katarzyna Zielińska', 'k.zielinska@uniwersytet.edu.pl', 1, 1, 3.75),
    (15, 1, 2, 'Podstawy elektroniki', 'PE', 'Układy analogowe, cyfrowe i elementy elektroniczne', 4,
     'mgr inż. Łukasz Wrona', 'l.wrona@uniwersytet.edu.pl', 1, 1, 4.25),
    (16, 1, 2, 'Wychowanie fizyczne', 'WF', 'Zajęcia ruchowe i aktywność fizyczna', 1, 'mgr Ewa Król',
     'e.krol@uniwersytet.edu.pl', 0, 1, 5.00),

    -- past semester 2023/2024 winter
    (17, 1, 1, 'Wstęp do informatyki', 'WDI', 'Fundamenty informatyki, reprezentacja danych i systemy liczbowe', 5,
     'dr hab. Jan Kowalski', 'j.kowalski@uniwersytet.edu.pl', 1, 1, 4.00),
    (18, 1, 1, 'Fizyka dla informatyków', 'FDI', 'Podstawy fizyki potrzebne w naukach technicznych', 4,
     'prof. dr hab. Maria Mazur', 'm.mazur@uniwersytet.edu.pl', 1, 1, 3.50),
    (19, 1, 1, 'Metody numeryczne', 'MN', 'Przybliżenia, interpolacja, rozwiązywanie równań i układów', 4,
     'dr inż. Tomasz Lewandowski', 't.lewandowski@uniwersytet.edu.pl', 1, 1, 4.25),
    (20, 1, 1, 'Język obcy specjalistyczny', 'JOS', 'Terminologia techniczna i komunikacja w środowisku IT', 2,
     'lektor Anna Zielińska', 'a.zielinska@uniwersytet.edu.pl', 0, 1, 4.75);


insert into pasta_db.attendance_record (id, userId, subjectId, scheduleEntryId, classDate, wasPresent)
values
    -- current semester
    (1, 1, 1, 5, '2026-05-21', 1),
    (2, 1, 2, 4, '2026-05-21', 1),
    (3, 1, 3, 6, '2025-05-22', 0),
    (4, 1, 1, 5, '2026-04-02', 1),
    (5, 1, 1, 1, '2026-04-09', 1),
    (6, 1, 1, 5, '2026-04-16', 0),
    (7, 1, 1, 1, '2026-04-23', 1),
    (8, 1, 2, 2, '2026-04-03', 1),
    (9, 1, 2, 4, '2026-04-10', 1),
    (10, 1, 2, 2, '2026-04-17', 0),
    (11, 1, 3, 3, '2026-04-04', 1),
    (12, 1, 3, 6, '2026-04-11', 1),
    (13, 1, 3, 3, '2026-04-18', 1),
    (14, 1, 4, 7, '2026-04-07', 1),
    (15, 1, 4, 7, '2026-04-14', 1),
    (16, 1, 5, 8, '2026-04-08', 0),
    (17, 1, 5, 8, '2026-04-15', 1),
    (18, 1, 6, 9, '2026-04-09', 1),
    (19, 1, 6, 9, '2026-04-16', 1),
    (20, 1, 7, 10, '2026-04-10', 1),
    (21, 1, 8, 11, '2026-04-11', 1),

    -- archived semesters
    (22, 1, 9, 12, '2025-11-03', 1),
    (23, 1, 9, 12, '2025-11-10', 1),
    (24, 1, 9, 12, '2025-11-17', 0),
    (25, 1, 10, 13, '2025-11-04', 1),
    (26, 1, 10, 13, '2025-11-11', 1),
    (27, 1, 11, 14, '2025-11-05', 1),
    (28, 1, 11, 14, '2025-11-12', 1),
    (29, 1, 12, 15, '2025-11-06', 1),
    (30, 1, 13, 16, '2025-03-03', 1),
    (31, 1, 13, 16, '2025-03-10', 1),
    (32, 1, 14, 17, '2025-03-04', 0),
    (33, 1, 14, 17, '2025-03-11', 1),
    (34, 1, 15, 18, '2025-03-05', 1),
    (35, 1, 16, 19, '2025-03-07', 1),
    (36, 1, 17, 20, '2024-11-04', 1),
    (37, 1, 18, 21, '2024-11-05', 0),
    (38, 1, 19, 22, '2024-11-06', 1),
    (39, 1, 20, 23, '2024-11-08', 1);


insert into pasta_db.events (id, userId, subjectId, summary, description, type, eventDate, eventTime, tone)
values (1, 1, 1, 'Egzamin z programowania', 'Egzamin końcowy obejmujący materiał z całego semestru', 'Egzamin',
        '2026-05-27', '10:15:00', 'red'),
       (2, 1, 3, 'Oddanie projektu', 'Projekt końcowy - system zarządzania bazą danych', 'Projekt', '2026-05-28', null,
        'amber'),
       (3, 1, 2, 'Kolokwium - Matematyka', NULL, 'Kolokwium', '2026-05-29', '12:15:00', 'green'),
       (4, 1, 4, 'Oddanie projektu z algorytmów', 'Implementacja drzewa AVL i analiza złożoności', 'Projekt',
        '2026-06-12', '23:59:00', 'amber'),
       (5, 1, 5, 'Kolokwium z baz danych', 'Normalizacja, JOIN-y, indeksy i transakcje', 'Kolokwium', '2026-06-15',
        '09:30:00', 'green'),
       (6, 1, 6, 'Egzamin z inżynierii oprogramowania', 'Egzamin pisemny i omówienie projektu zespołowego', 'Egzamin',
        '2026-06-18', '11:00:00', 'red'),
       (7, 1, 7, 'Laboratorium sieciowe', 'Konfiguracja VLAN, routing i diagnostyka połączeń', 'Laboratorium',
        '2026-06-11', '14:15:00', 'purple'),
       (8, 1, 8, 'Prezentacja techniczna', 'Krótka prezentacja po angielsku o wybranej technologii', 'Prezentacja',
        '2026-06-20', '10:00:00', 'purple'),
       (9, 1, 9, 'Zzaliczenie z Programowania obiektowego II', NULL,
        'Egzamin', '2026-02-10', null, 'green'),
       (10, 1, 10, 'Egzamin z matematyki dyskretnej', 'Egzamin końcowy z grafów i kombinatoryki', 'Egzamin',
        '2026-02-12', '08:30:00', 'amber'),
       (11, 1, 13, 'Egzamin z programowania', null,
        'Egzamin', '2024-06-14', '09:00:00', 'purple');


insert into pasta_db.grades (id, userId, subjectId, name, value, weight, gradedOn)
values
    -- current semester
    (1, 1, 1, 'Egzamin', 5.00, 3.00, '2026-05-20'),
    (2, 1, 1, 'Wejściówka', 4.50, 2.00, '2026-05-10'),
    (3, 1, 1, 'Aktywność', 5.00, 1.00, '2026-05-15'),
    (4, 1, 2, 'Egzamin', 4.00, 3.00, '2026-05-18'),
    (5, 1, 2, 'Kolokwium', 2.00, 2.00, '2026-05-20'),
    (6, 1, 2, 'Kartkówka', 3.50, 1.00, '2026-04-05'),
    (7, 1, 3, 'Projekt', 5.00, 3.00, '2026-05-20'),
    (8, 1, 3, 'Kolokwium', 5.00, 2.00, '2026-05-10'),
    (9, 1, 4, 'Sprawdzian 1', 4.50, 1.00, '2026-04-05'),
    (10, 1, 4, 'Sprawdzian 2', 5.00, 1.50, '2026-05-06'),
    (11, 1, 4, 'Projekt', 5.00, 2.00, '2026-06-01'),
    (12, 1, 5, 'Laboratorium 1', 4.00, 1.00, '2026-04-08'),
    (13, 1, 5, 'Laboratorium 2', 4.50, 1.00, '2026-05-13'),
    (14, 1, 5, 'Kolokwium', 3.50, 2.00, '2026-06-02'),
    (15, 1, 6, 'Projekt zespołowy', 5.00, 2.00, '2026-05-20'),
    (16, 1, 6, 'Dokumentacja', 4.50, 1.00, '2026-05-28'),
    (17, 1, 7, 'Test sieciowy', 4.00, 1.00, '2026-05-09'),
    (18, 1, 8, 'Prezentacja', 5.00, 1.00, '2026-05-30'),

    -- archived semesters
    (19, 1, 9, 'Egzamin', 4.50, 3.00, '2025-01-20'),
    (20, 1, 9, 'Ćwiczenia', 4.00, 1.00, '2025-01-10'),
    (21, 1, 10, 'Kolokwium', 4.00, 2.00, '2025-01-15'),
    (22, 1, 11, 'Projekt', 5.00, 3.00, '2025-01-25'),
    (23, 1, 12, 'Ćwiczenia', 4.00, 1.00, '2025-01-18'),
    (24, 1, 13, 'Zaliczenie', 5.00, 2.00, '2024-06-10'),
    (25, 1, 13, 'Projekt', 5.00, 2.00, '2024-06-20'),
    (26, 1, 14, 'Egzamin', 3.50, 3.00, '2024-06-18'),
    (27, 1, 15, 'Laboratorium', 4.00, 2.00, '2024-06-15'),
    (28, 1, 16, 'Zajęcia praktyczne', 5.00, 1.00, '2024-06-22'),
    (29, 1, 17, 'Kolokwium', 4.00, 2.00, '2024-01-18'),
    (30, 1, 18, 'Egzamin', 3.00, 3.00, '2024-01-25'),
    (31, 1, 19, 'Projekt', 4.50, 2.00, '2024-01-30'),
    (32, 1, 20, 'Zaliczenie', 5.00, 1.00, '2024-01-22');


insert into pasta_db.subject_class_types (subjectId, classTypeId)
values (1, 1),
       (2, 1),
       (3, 1),
       (1, 2),
       (3, 2),
       (2, 3),
       (1, 4),
       (3, 5),
       (4, 1),
       (4, 2),
       (5, 1),
       (5, 2),
       (6, 1),
       (6, 5),
       (7, 1),
       (7, 3),
       (8, 5),
       (9, 1),
       (9, 4),
       (10, 1),
       (11, 1),
       (11, 2),
       (12, 4),
       (12, 5),
       (13, 1),
       (13, 2),
       (14, 1),
       (15, 1),
       (15, 2),
       (16, 3),
       (17, 1),
       (18, 1),
       (19, 1),
       (19, 2),
       (20, 5);


insert into pasta_db.subject_teachers (id, subjectId, name)
values (1, 1, 'mgr Anna Nowak'),
       (2, 2, 'mgr Anna Nowak'),
       (8, 9, 'dr hab. Jan Kowalski'),
       (9, 10, 'prof. dr hab. Katarzyna Zielińska'),
       (10, 11, 'mgr Michał Dąbrowski'),
       (11, 12, 'dr Piotr Wiśniewski'),
       (12, 13, 'dr hab. Jan Kowalski'),
       (13, 14, 'prof. dr hab. Katarzyna Zielińska'),
       (14, 15, 'mgr inż. Łukasz Wrona'),
       (15, 16, 'mgr Ewa Król'),
       (16, 17, 'dr hab. Jan Kowalski'),
       (17, 18, 'prof. dr hab. Maria Mazur'),
       (18, 19, 'dr inż. Tomasz Lewandowski');