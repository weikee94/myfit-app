-- Update existing exercise demo images to use working public-domain photos
-- from yuhonas/free-exercise-db.
-- Run this (or apply the migration) to fix images on your current Supabase data.
-- These match the seed in 008_seed_exercises.sql.

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Front_Lat_Pulldown/0.jpg',
  demo_type = 'image'
WHERE name = 'Lat Pulldown';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_One_Arm_Dumbbell_Row/0.jpg',
  demo_type = 'image'
WHERE name = 'Single-Arm Dumbbell Row';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Face_Pull/0.jpg',
  demo_type = 'image'
WHERE name = 'Cable Face Pull';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Chin-Up/0.jpg',
  demo_type = 'image'
WHERE name = 'Pull-Up';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two_Dumbbell_Row/0.jpg',
  demo_type = 'image'
WHERE name = 'TRX Suspension Row';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bulgarian_Split_Squat/0.jpg',
  demo_type = 'image'
WHERE name = 'Bulgarian Split Squat';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg',
  demo_type = 'image'
WHERE name = 'Barbell Hip Thrust';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg',
  demo_type = 'image'
WHERE name = 'Romanian Deadlift';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg',
  demo_type = 'image'
WHERE name = 'Leg Press';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Seated_Calf_Raise/0.jpg',
  demo_type = 'image'
WHERE name = 'Nordic Hamstring Curl';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg',
  demo_type = 'image'
WHERE name = 'Single-Leg Romanian Deadlift';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Step_Ups/0.jpg',
  demo_type = 'image'
WHERE name = 'Box Step-Up';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Calf_Raise_On_A_Dumbbell/0.jpg',
  demo_type = 'image'
WHERE name = 'Single-Leg Calf Raise';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg',
  demo_type = 'image'
WHERE name = 'Conventional Deadlift';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg',
  demo_type = 'image'
WHERE name = 'Back Squat';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shoulder_Press/0.jpg',
  demo_type = 'image'
WHERE name = 'Overhead Press';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Barbell_Squat/0.jpg',
  demo_type = 'image'
WHERE name = 'Front Squat';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Seated_Calf_Raise/0.jpg',
  demo_type = 'image'
WHERE name = 'Pallof Press';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Adductor/0.jpg',
  demo_type = 'image'
WHERE name = 'Copenhagen Adductor Hold';

UPDATE exercises SET 
  demo_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dead_Bug/0.jpg',
  demo_type = 'image'
WHERE name = 'Dead Bug';