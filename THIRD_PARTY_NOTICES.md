# Third-party notices

## Exercise library text (`supabase/migrations/010_import_opengym_exercises.sql`)

About 1,300 exercises (names, equipment, target/secondary muscles and step-by-step
instructions) were imported from the [openGym](https://github.com/DuarteSantos8/openGym)
catalogue by `scripts/import-opengym-exercises.mjs`.

Only catalogue entries marked `"textSource": "exercisedb"` were used. Their text originates
from [ExerciseDB v1](https://exercisedb.dev/) by AscendAPI and was published through
[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) under the
MIT licence below.

The following were deliberately **not** imported:

- openGym's own exercise text (newer entries, every `description`, `muscleMap` corrections,
  translations). These are AGPL-3.0.
- openGym's exercise stills and animations (`catalogue/media/`). They are licensed to openGym
  by Gym visual (gymvisual.com) and may not be reused in other apps.

```
MIT License

Copyright (c) 2026 Hasan Emir Yıldırım

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation and data files (the "Software"),
to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
