CREATE DATABASE IF NOT EXISTS `pasta_db`;
USE `pasta_db`;

create table class_types
(
    id    int auto_increment
        primary key,
    label varchar(64) not null,
    constraint class_types_label_unique
        unique (label)
);

create table users
(
    id           int auto_increment
        primary key,
    email        varchar(255) not null,
    passwordHash text         not null,
    name         varchar(100) not null,
    surname      varchar(100) not null,
    groupName    varchar(100) null
);

create table schedule_entries
(
    id          int auto_increment
        primary key,
    userId      int                                                                                 not null,
    subjectId   int                                                                                 not null,
    dayOfWeek   enum ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') not null,
    startsAt    time                                                                                not null,
    endsAt      time                                                                                not null,
    classTypeId int                                                                                 null,
    location    varchar(100)                                                                        null,
    teacherName varchar(255)                                                                        null,
    constraint schedule_entries_class_types_id_fk
        foreign key (classTypeId) references class_types (id)
            on delete set null,
    constraint schedule_entries_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade,
    constraint check_validTime
        check (`endsAt` > `startsAt`)
);

create table semesters
(
    id        int auto_increment
        primary key,
    userId    int                  not null,
    name      varchar(255)         not null,
    startsOn  date                 null,
    endsOn    date                 null,
    isCurrent tinyint(1) default 0 not null,
    constraint semesters_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade,
    constraint check_validDates
        check ((`endsOn` is null) or (`startsOn` is null) or (`endsOn` > `startsOn`))
);

create table sessions
(
    id        varchar(36)                         not null
        primary key,
    userId    int                                 not null,
    expiresAt timestamp                           not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    constraint sessions_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table subjects
(
    id                int auto_increment
        primary key,
    userId            int                  not null,
    semesterId        int                  null,
    name              varchar(255)         not null,
    code              varchar(64)          null,
    description       text                 null,
    ects              tinyint              null,
    coordinatorName   varchar(255)         null,
    coordinatorEmail  varchar(255)         null,
    presenceMandatory tinyint(1) default 1 not null,
    archived          tinyint(1) default 0 not null,
    finalGrade        decimal(4, 2)        null,
    constraint subjects_semesters_id_fk
        foreign key (semesterId) references semesters (id)
            on delete set null,
    constraint subjects_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table attendance_record
(
    id              int auto_increment
        primary key,
    userId          int        not null,
    subjectId       int        not null,
    scheduleEntryId int        null,
    classDate       date       not null,
    wasPresent      tinyint(1) not null,
    constraint attendance_record_schedule_entries_id_fk
        foreign key (scheduleEntryId) references schedule_entries (id)
            on delete set null,
    constraint attendance_record_subjects_id_fk
        foreign key (subjectId) references subjects (id)
            on delete cascade,
    constraint attendance_record_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table events
(
    id          int auto_increment
        primary key,
    userId      int                                                      not null,
    subjectId   int                                                      null,
    summary     varchar(255)                                             not null,
    description text                                                     null,
    type        varchar(100)                                             not null,
    eventDate   date                                                     not null,
    eventTime   time                                                     null,
    tone        enum ('red', 'amber', 'green', 'purple') default 'green' not null,
    constraint events_subjects_id_fk
        foreign key (subjectId) references subjects (id)
            on delete cascade,
    constraint events_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table grades
(
    id        int auto_increment
        primary key,
    userId    int                        not null,
    subjectId int                        not null,
    name      varchar(100)               not null,
    value     decimal(4, 2)              not null,
    weight    decimal(4, 2) default 1.00 not null,
    gradedOn  date                       not null,
    constraint grades_subjects_id_fk
        foreign key (subjectId) references subjects (id)
            on delete cascade,
    constraint grades_users_id_fk
        foreign key (userId) references users (id)
            on delete cascade
);

create table subject_class_types
(
    subjectId   int not null,
    classTypeId int not null,
    primary key (subjectId, classTypeId),
    constraint subject_class_types_class_types_id_fk
        foreign key (classTypeId) references class_types (id)
            on delete cascade,
    constraint subject_class_types_subjects_id_fk
        foreign key (subjectId) references subjects (id)
            on delete cascade
);

create table subject_teachers
(
    id        int auto_increment
        primary key,
    subjectId int          not null,
    name      varchar(255) not null,
    constraint subject_teachers_subjects_id_fk
        foreign key (subjectId) references subjects (id)
            on delete cascade
);

create view v_attendance_latest as
select ar.userId     AS userId,
       ar.classDate  AS classDate,
       ar.wasPresent AS wasPresent,
       s.name        AS subjectName,
       ct.label      AS classType
from pasta_db.attendance_record ar
         join pasta_db.subjects s on ((ar.subjectId = s.id))
         left join pasta_db.schedule_entries se on ((ar.scheduleEntryId = se.id))
         left join pasta_db.class_types ct on ((se.classTypeId = ct.id))
order by ar.classDate;

create view v_attendance_summary as
select ar.userId                    AS userId,
       s.name                       AS subjectName,
       count(ar.id)                 AS attendanceCount,
       sum((ar.wasPresent = true))  AS numPresent,
       sum((ar.wasPresent = false)) AS numAbsent
from pasta_db.attendance_record ar
         left join pasta_db.subjects s on ((ar.subjectId = s.id))
group by ar.subjectId, ar.userId;

create view v_events_upcoming as
select e.userId      AS userId,
       e.id          AS eventId,
       e.summary     AS summary,
       e.eventDate   AS eventDate,
       e.eventTime   AS eventTime,
       e.description AS description,
       e.type        AS type,
       e.tone        AS tone,
       s.name        AS subjectName
from pasta_db.events e
         left join pasta_db.subjects s on ((e.subjectId = s.id))
where e.eventDate > curdate()
   or (e.eventDate = curdate() and e.eventTime >= curtime())
order by e.eventDate, e.eventTime;

create view v_grade_details as
select g.id        AS gradeId,
       g.userId    AS userId,
       g.subjectId AS subjectId,
       s.name      AS subjectName,
       g.value     AS value,
       g.weight    AS weight,
       g.gradedOn  AS gradedOn,
       g.name      AS name
from pasta_db.grades g
         join pasta_db.subjects s on ((g.subjectId = s.id));

create view v_schedule_display as
select se.id          AS scheduleEntryId,
       se.userId      AS userId,
       se.subjectId   AS subjectId,
       s.name         AS name,
       se.dayOfWeek   AS dayOfWeek,
       se.startsAt    AS startsAt,
       se.endsAt      AS endsAt,
       se.location    AS location,
       se.teacherName AS teacherName,
       ct.label       AS classType
from pasta_db.schedule_entries se
         left join pasta_db.subjects s on ((s.id = se.subjectId))
         left join pasta_db.class_types ct on ((ct.id = se.classTypeId))
order by se.startsAt;

create view v_subject_grade_summary as
select s.userId                                                                       AS userId,
       s.id                                                                           AS subjectId,
       coalesce(s.finalGrade, (sum((g.value * g.weight)) / nullif(sum(g.weight), 0))) AS grade
from pasta_db.subjects s
         left join pasta_db.grades g on ((g.subjectId = s.id) and (g.userId = s.userId))
group by s.userId, s.id, s.finalGrade;

create view v_subject_attendance_summary as
select ar.userId                                            AS userId,
       ar.subjectId                                         AS subjectId,
       count(ar.id)                                         AS attendanceCount,
       sum((ar.wasPresent = true))                          AS numPresent,
       sum((ar.wasPresent = false))                         AS numAbsent,
       ((100 * sum((ar.wasPresent = true))) / count(ar.id)) AS attendancePct
from pasta_db.attendance_record ar
group by ar.userId, ar.subjectId;

create view v_semester_subject_summary as
select sem.userId      AS userId,
       sem.id          AS semesterId,
       sem.name        AS semesterName,
       sem.startsOn    AS startsOn,
       sem.endsOn      AS endsOn,
       sem.isCurrent   AS isCurrent,
       s.id            AS subjectId,
       s.name          AS subjectName,
       s.ects          AS ects,
       g.grade         AS grade,
       a.attendancePct AS attendancePct
from pasta_db.semesters sem
         left join pasta_db.subjects s on ((s.semesterId = sem.id) and (s.userId = sem.userId))
         left join pasta_db.v_subject_grade_summary g on ((g.userId = sem.userId) and (g.subjectId = s.id))
         left join pasta_db.v_subject_attendance_summary a on ((a.userId = sem.userId) and (a.subjectId = s.id));

create view v_subject_details as
select s.id                                                                AS subjectId,
       s.userId                                                            AS userId,
       s.name                                                              AS name,
       s.code                                                              AS code,
       s.description                                                       AS description,
       s.ects                                                              AS ects,
       s.coordinatorName                                                   AS coordinatorName,
       s.coordinatorEmail                                                  AS coordinatorEmail,
       s.presenceMandatory                                                 AS presenceMandatory,
       sem.name                                                            AS semesterName,
       group_concat(distinct st.name order by st.name ASC separator ';')   AS teachers,
       group_concat(distinct ct.label order by ct.label ASC separator ';') AS classTypes
from pasta_db.subjects s
         join pasta_db.semesters sem on ((sem.id = s.semesterId))
         left join pasta_db.subject_teachers st on ((st.subjectId = s.id))
         left join pasta_db.subject_class_types stct on ((stct.subjectId = s.id))
         left join pasta_db.class_types ct on ((ct.id = stct.classTypeId))
where (sem.isCurrent = 1)
group by s.id;