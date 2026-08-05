-- ============================================================
-- Student Behavior Points System — schema only (no seed data)
-- This same file is what you'll run against your prod database
-- (Supabase / Neon / any Postgres) when you migrate.
-- ============================================================

CREATE TABLE schools (
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE admins (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    school_id       INTEGER REFERENCES schools(id),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE staff (
    id              SERIAL PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    school_id       INTEGER NOT NULL REFERENCES schools(id),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE students (
    id                   SERIAL PRIMARY KEY,
    student_number       VARCHAR(50) NOT NULL UNIQUE,
    first_name           VARCHAR(100) NOT NULL,
    middle_name          VARCHAR(100),
    last_name            VARCHAR(100) NOT NULL,
    birthday             DATE,
    address              VARCHAR(255),
    email                VARCHAR(255) NOT NULL UNIQUE,
    phone_number         VARCHAR(30),
    parent_phone_number  VARCHAR(30),
    password_hash        VARCHAR(255) NOT NULL,
    school_id            INTEGER NOT NULL REFERENCES schools(id),
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE terms (
    id          SERIAL PRIMARY KEY,
    school_id   INTEGER NOT NULL REFERENCES schools(id),
    name        VARCHAR(100) NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    is_current  BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (school_id, name)
);

CREATE UNIQUE INDEX one_current_term_per_school
    ON terms (school_id)
    WHERE is_current = TRUE;

CREATE TABLE criteria (
    id          SERIAL PRIMARY KEY,
    school_id   INTEGER NOT NULL REFERENCES schools(id),
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (school_id, name)
);

CREATE TABLE performance_levels (
    id           SERIAL PRIMARY KEY,
    criteria_id  INTEGER NOT NULL REFERENCES criteria(id),
    name         VARCHAR(100) NOT NULL,
    points       INTEGER NOT NULL,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (criteria_id, name)
);

CREATE TABLE point_entries (
    id                     SERIAL PRIMARY KEY,
    student_id             INTEGER NOT NULL REFERENCES students(id),
    staff_id               INTEGER NOT NULL REFERENCES staff(id),
    performance_level_id   INTEGER NOT NULL REFERENCES performance_levels(id),
    term_id                INTEGER NOT NULL REFERENCES terms(id),
    points_awarded         INTEGER NOT NULL,
    note                   VARCHAR(255),
    created_at             TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_point_entries_student_term ON point_entries (student_id, term_id);
CREATE INDEX idx_point_entries_staff        ON point_entries (staff_id);
CREATE INDEX idx_point_entries_term         ON point_entries (term_id);

-- Total points per student per term — replaces a stored "totalPoints" column
CREATE VIEW student_term_totals AS
SELECT
    s.id            AS student_id,
    s.student_number,
    s.first_name,
    s.last_name,
    s.school_id,
    t.id            AS term_id,
    t.name          AS term_name,
    COALESCE(SUM(pe.points_awarded), 0) AS total_points
FROM students s
JOIN terms t
    ON t.school_id = s.school_id
LEFT JOIN point_entries pe
    ON pe.student_id = s.id AND pe.term_id = t.id
GROUP BY s.id, s.student_number, s.first_name, s.last_name, s.school_id, t.id, t.name;

-- Line-by-line history for a student's report page (student portal + admin drill-down)
CREATE VIEW student_point_history AS
SELECT
    pe.id                                 AS entry_id,
    pe.student_id,
    pe.term_id,
    t.name                                AS term_name,
    c.name                                AS criteria_name,
    pl.name                               AS performance_name,
    pe.points_awarded,
    st.first_name || ' ' || st.last_name  AS awarded_by,
    pe.note,
    pe.created_at
FROM point_entries pe
JOIN performance_levels pl ON pl.id = pe.performance_level_id
JOIN criteria c            ON c.id = pl.criteria_id
JOIN terms t                ON t.id = pe.term_id
JOIN staff st                ON st.id = pe.staff_id
ORDER BY pe.created_at DESC;
