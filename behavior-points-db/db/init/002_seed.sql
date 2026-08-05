-- ============================================================
-- Sample data for local development only.
-- password_hash values below are PLACEHOLDERS, not real hashes —
-- swap them for real bcrypt/argon2 hashes once you wire up auth.
-- Do NOT run this file against production.
-- ============================================================

INSERT INTO schools (name) VALUES
    ('ISSP'),
    ('Arqm Academy');

INSERT INTO terms (school_id, name, start_date, end_date, is_current) VALUES
    (1, 'Term 1 - 2025/2026', '2025-09-01', '2026-01-15', TRUE),
    (2, 'Term 1 - 2025/2026', '2025-09-01', '2026-01-15', TRUE);

INSERT INTO criteria (school_id, name, description) VALUES
    (1, 'Homework', 'Quality and consistency of homework submissions'),
    (1, 'Attendance', 'Showing up on time, ready to learn'),
    (1, 'Participation', 'Engagement during class activities');

INSERT INTO performance_levels (criteria_id, name, points) VALUES
    (1, 'Consistent', 2),
    (1, 'Creative', 5),
    (1, 'Not doing well', -3),
    (2, 'On time', 2),
    (2, 'Late', -2),
    (2, 'Absent without notice', -5),
    (3, 'Active', 3),
    (3, 'Disruptive', -4);

INSERT INTO admins (email, password_hash, school_id) VALUES
    ('admin@issp.edu', 'PLACEHOLDER_HASH_admin123', NULL);

INSERT INTO staff (first_name, last_name, email, password_hash, school_id) VALUES
    ('John', 'Carter', 'j.carter@issp.edu', 'PLACEHOLDER_HASH_staff123', 1),
    ('Maria', 'Lopez', 'm.lopez@issp.edu', 'PLACEHOLDER_HASH_staff123', 1);

INSERT INTO students
    (student_number, first_name, last_name, birthday, address, email, phone_number, parent_phone_number, password_hash, school_id)
VALUES
    ('ISSP-1001', 'Ahmed', 'Youssef', '2012-03-14', '12 Cedar St', 'ahmed.y@issp.edu', '555-0101', '555-0901', 'PLACEHOLDER_HASH_student123', 1),
    ('ISSP-1002', 'Lina', 'Haddad',  '2012-07-02', '45 Palm Ave', 'lina.h@issp.edu',  '555-0102', '555-0902', 'PLACEHOLDER_HASH_student123', 1),
    ('ISSP-1003', 'Omar', 'Saleh',   '2011-11-21', '9 Maple Rd',  'omar.s@issp.edu',  '555-0103', '555-0903', 'PLACEHOLDER_HASH_student123', 1);

-- A handful of point entries so the reports/views return real data
INSERT INTO point_entries (student_id, staff_id, performance_level_id, term_id, points_awarded, note) VALUES
    (1, 1, 1, 1, 2,  NULL),                          -- Ahmed: Homework - Consistent
    (1, 2, 7, 1, 3,  NULL),                          -- Ahmed: Participation - Active
    (2, 1, 2, 1, 5,  'Great science fair project'),  -- Lina: Homework - Creative
    (2, 1, 5, 1, -2, 'Arrived 10 min late'),          -- Lina: Attendance - Late
    (3, 2, 8, 1, -4, NULL),                          -- Omar: Participation - Disruptive
    (3, 2, 4, 1, 2,  NULL);                          -- Omar: Attendance - On time
