# Gym Engine for everyone who moves

Gym Engine serves three audiences: public visitors, independent exercisers, and gym operators. A gym membership is never a prerequisite for learning or using the public planning tools.

## Public routes

- `/`: public discovery hub; no authentication or gym database query.
- `/foods`: searchable starter catalog of familiar ingredients, uses, and listed allergens. It does not claim verified nutrient composition.
- `/exercises`: searchable home/gym movement references with starting cues and easier variations.
- `/learn`: food, movement, energy, personal tracking, and gym-management explainers with links to sources.
- `/planner`: anonymous editable meal and routine drafts using goal, diet, listed exclusions, equipment, experience, and 2/3/4-day availability. Optional age/height/weight inputs produce a published resting-energy estimate, not a total daily calorie prescription.
- `/my-space`: personal intake logs, exercise records, and saved plans. No gym or staff account required.
- `/manage`: protected gym operations; `/login` remains staff authentication/setup.

## Personal storage in this milestone

Personal records are stored only in browser localStorage under `gym-engine-personal-v1`. Nutrient fields may remain unknown. The app does not infer calories from a dish name, infer calories burned from an exercise name, or send personal logs to the gym database. It explicitly warns that records are visible to others using the same browser profile, do not sync across devices, and disappear when browser data is cleared. JSON export is available for a local backup; backup restoration/import is not implemented yet.

Saving a plan explicitly saves its planning profile, meal edits, and routine edits on that device. Generating a draft alone does not persist it. The app validates stored structure before displaying it, preserves unreadable storage, handles save failures, and detects a changed journal before overwriting another tab's work.

The initial planner is transparent template/rule logic, not AI or a trained recommendation model. The ingredient filter covers only the listed allergens and cannot assess preparation/cross-contact. User edits are not rechecked for excluded ingredients. The meal drafts have no automatic portion sizes or daily calorie deficit/surplus.

## Individual accounts: next persistence milestone

Introduce a personal identity independent of `GymMember` and `Staff`. An individual can join zero, one, or several gyms, but owns their intake history, workouts, body records, and plans. Gym/trainer access must be explicitly granted and revocable. Public reading and draft generation must remain available anonymously after personal accounts are introduced.

Next: account-based syncing and recovery, backup import, entry editing, body/progress history, custom food/recipe nutrition with portion conversions and provenance, richer routine scheduling, and reviewed recommendations. The current implementation does not claim these are complete.

## Sources

- Healthy eating principles: https://www.who.int/news-room/fact-sheets/detail/healthy-diet
- General physical activity: https://www.who.int/news-room/fact-sheets/detail/physical-activity
- Optional resting-energy equation: Mifflin et al. (1990), https://pubmed.ncbi.nlm.nih.gov/2305711/

The formula's published male/female coefficients are explained in the form. Unsupported ages/measurements are rejected. Resting energy is labelled separately from total daily needs and is not used as an intake target.
