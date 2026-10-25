# Gym Engine for everyone who moves

Gym Engine serves public visitors, independent exercisers, and gym operators. Public learning and one-time meal/routine drafts never require an account or gym membership.

## Public experience

- `/planner`: editable meal and movement drafts by goal, diet preference, listed exclusions, equipment, experience, available days, muscle focus, and functional preference. Height/weight/age can produce an optional resting-energy estimate, not an intake target.
- `/foods`, `/exercises`, `/movements/[slug]`: starter ingredient and movement references with muscle, equipment, and seated/standing/floor filters. These catalogs are expanding, not exhaustive.
- `/diets`, `/diets/[slug]`, `/research`: diet-style and accessible-movement education with original sources, evidence limits, and honest editorial attribution.
- `/assistant`: source retrieval by default; optional AI explanations require explicit consent and configured credentials. No account history is automatically sent to AI.
- `/learn`: introductory fitness and gym-management knowledge.

## Personal records

`/account` supports email/password identity independent of gym staff. `/my-space` requires that account to save/read intake, workouts, plans, and optional progress measurements. Nutrient fields can remain unknown; exercise calories are not inferred. Records use authenticated server APIs with ownership taken from the session and revision checks to reject conflicting writes. JSON export is available; restoration/import and entry editing remain future work.

Development uses ignored `platform/data/personal.sqlite`; production requires PostgreSQL and explicit migrations. Earlier browser-local records are retained on the original device and are never automatically uploaded. Gym staff cannot read personal journals through the staff workspace. Production account signup requires configured email verification. Google/Microsoft integrations are prepared but disabled until configured; ChatGPT requires approved partner access.

## Planning boundaries

The planner uses templates and rules, not trained ML. Listed allergen exclusions cannot evaluate preparation/cross-contact, and user edits are not rechecked. Diet styles are educational patterns, not therapeutic prescriptions. Keto, carnivore, and fasting choices link to education rather than generating restrictive prescriptions. Medical flags ask for individualized professional assessment before automatic planning. Optional gender does not determine exercise suitability; functional preferences and goals guide movement selection.

Published sources are linked on each guide. Gym Engine editorial is not presented as a licensed clinician. Clinical review and a larger catalog are still needed. See [deployment and integrations](DEPLOYMENT-AND-INTEGRATIONS.md) for configuration and remaining production work, including durable staff storage.
