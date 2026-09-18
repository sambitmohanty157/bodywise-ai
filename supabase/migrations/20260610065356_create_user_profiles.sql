/*
# Create user_profiles table

1. New Tables
- `user_profiles`
  - `id` (uuid, primary key, linked to auth.users)
  - `full_name` (text)
  - `age` (integer)
  - `gender` (text)
  - `height_cm` (numeric)
  - `current_weight_kg` (numeric)
  - `goal_weight_kg` (numeric)
  - `fitness_goal` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `user_profiles`.
- Owner-scoped CRUD policies so each authenticated user can only access and modify their own profile.
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  age integer,
  gender text,
  height_cm numeric,
  current_weight_kg numeric,
  goal_weight_kg numeric,
  fitness_goal text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON user_profiles;
CREATE POLICY "delete_own_profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);
