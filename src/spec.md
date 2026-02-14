# Specification

## Summary
**Goal:** Add Teacher/Student role selection during onboarding, enforce role-based navigation/access, and introduce a Student Portal for practice paper solving with a local “AI Doubt Solver”.

**Planned changes:**
- Update the Profile Setup modal to require selecting a role (Teacher or Student) alongside name, persist the role in the user profile, and reuse it on future logins (no re-prompt if profile already exists).
- Display a prominent student warning in the role selection experience (at minimum when Student is selected) with the exact text: "Warning for students: Do not use a Teacher account. If you use a Teacher account, you will be banned permanently."
- Add role-based navigation and route protection: Teacher-only access to existing teacher pages (Generate, My Papers, Paper Detail, Merge Papers) and a Student-only “Student Portal” route/link; show an in-app access denied message for disallowed routes.
- Create a Student Portal page where students can generate a practice paper using the existing local generator inputs and solve it interactively (answer MCQs, navigate, submit, and view score + per-question correct/incorrect feedback with correct answers).
- Add an “AI Doubt Solver” within the Student Portal so students can ask a doubt per question and receive an immediate locally-generated response derived from the current question (includes correct option and a short explanation; no external AI/LLM calls).

**User-visible outcome:** New users must choose Teacher or Student during setup (with a clear student warning). Teachers see and can use only teacher workflows, students see a Student Portal where they can generate and solve practice papers and use a built-in doubt helper while solving, with access denied messaging if they open the wrong pages.
