# Features and access

Gym Engine has three connected experiences: public fitness learning, personal planning/tracking, and gym operations. A personal account is independent of gym membership and staff access.

## Capability status

| Area                   | Available now                                                                                                        | Remaining work                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Public education       | Eight source-linked guides, evidence limitations, food references                                                    | Larger food library, verified portions/nutrients, qualified clinical review, localization       |
| Exercise library       | 24 movement references; muscle, equipment, position filters                                                          | More movements, reviewed adaptations, demonstrations, richer progression                        |
| Planner                | Anonymous editable meal/routine drafts; diet preferences, exclusions, goals, equipment, days, functional preferences | Verified nutrient totals, richer scheduling, specialist-reviewed personalization                |
| Diet styles            | Public education on balanced, plant-based, keto, meat-forward/carnivore, intermittent fasting, DASH                  | Therapeutic or restrictive prescriptions are not generated automatically                        |
| Personal records       | Email/password identity, intake/workout logs, saved plans, optional measurements, JSON export                        | Import/restore, entry editing, retention/deletion interface, shared coaching consent            |
| Social sign-in         | Google/Microsoft integration prepared; conditional ChatGPT provider                                                  | Registered clients and live testing; approved partner access for ChatGPT                        |
| Research helper        | Public source retrieval with linked citations                                                                        | Optional AI configuration and adversarial/clinical evaluation                                   |
| Gym management         | Local members, memberships, balances, recorded payments, receipts, attendance, reports                               | Hosted staff storage, staff roles/invitations, configurable plans, freezes, corrections/refunds |
| Analytics              | Recorded gym totals, attendance trend, balances; personal measurement history                                        | Cohort/retention analytics and evaluated predictive models                                      |
| Discoverability        | Metadata, canonicals, Article/Breadcrumb data, sitemap, private-page noindex                                         | Production domain verification, reviewed content, indexing/monitoring                           |
| Payments               | Staff-confirmed cash/digital payment records                                                                         | Live eSewa/Khalti gateway integration; receipts are not tax invoices                            |
| Mobile / multiple gyms | Web interface and gym-scoped staff data foundation                                                                   | Mobile app, multi-gym provisioning, tenant-isolation evaluation                                 |

## Journeys

**Visitor:** browse evidence → explore foods/movements → create and edit a one-time draft. Reading and generating drafts do not require sign-in.

**Individual:** create account → save a plan → record intake/workouts → record optional progress → export records. Gym staff do not automatically gain access to this journal.

**Operator:** create the first local gym/owner → add member → assign membership → record a payment → check in → inspect balances and reports.

## Routes

| Route                                  | Access / purpose                                                        |
| -------------------------------------- | ----------------------------------------------------------------------- |
| `/`, `/learn`, `/foods`                | Public discovery and introductory knowledge                             |
| `/diets`, `/diets/[slug]`, `/research` | Public evidence guides and sources                                      |
| `/exercises`, `/movements/[slug]`      | Public movement catalog/details                                         |
| `/planner`                             | Anonymous meal/routine drafting; sign-in required for saving            |
| `/assistant`                           | Public source retrieval; explicit opt-in for configured AI explanations |
| `/account`, `/account/reset`           | Personal identity and recovery workflows                                |
| `/my-space`                            | Personal records require an authenticated individual account            |
| `/login`, `/manage`                    | Separate staff identity and protected gym operations                    |

## Personalization boundaries

Templates use preferences and functional needs. Optional gender does not impose exercise restrictions. Height/weight/age are used only for an optional resting-energy equation, not to claim a medically suitable food prescription. Medical flags stop automatic plan generation and suggest professional assessment. Keto/carnivore and fasting choices provide education rather than automatic restrictive prescriptions.

Read [privacy and recommendation boundaries](privacy-and-recommendations.md) before interpreting recommendations or collecting sensitive records.
