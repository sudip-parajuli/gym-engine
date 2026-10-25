# Privacy and recommendation boundaries

## Public and personal use

Reading guides, browsing catalogs, retrieving public sources, and generating one-time drafts do not require an account. Entered draft preferences remain in client state until a signed-in visitor explicitly saves a plan. Saving includes the plan and its entered planning profile.

Personal intake, workout, plan, and optional measurement records require an account. Gym staff do not automatically gain access. JSON exports contain personal data; store and share them carefully. Recovery/import, self-service data deletion, trainer-sharing consent, and a formal retention policy still need implementation before a public launch. This page describes current behavior, not a complete production privacy policy.

Local databases and auth secrets are ignored by Git. Hosted personal records require PostgreSQL. Authentication uses session cookies; configured identity and email providers process their respective authentication or delivery requests. Review provider terms and establish the production privacy/legal notices before launch.

## AI consent

Default research retrieval uses the application's public evidence library and does not call an AI model. When an operator configures AI, a visitor must opt in before the question and selected public summaries are sent to OpenAI. Journal history and health profiles are not automatically sent. Visitors should omit personal medical details. An API setting such as `store:false` is not a guarantee of zero provider retention; review the provider's current policies for the actual account configuration.

The helper is an educational research aid, not a licensed practitioner, autonomous coach, or clinical service. It cannot modify personal/gym records or contact external services on the visitor's behalf.

## Evidence and nutrition

Guides link original sources and describe evidence limitations. Editorial attribution is honest; no clinical credentials or source-publisher affiliations are claimed. The starter food catalog does not contain verified nutrient composition for every food, recipe, or serving.

Plans do not prescribe automatic deficits/surpluses or therapeutic nutrient targets. An optional resting-energy estimate is not total daily energy need or a recommended eating target. Listed allergen filtering cannot assess preparation or cross-contact, and custom edits are not automatically rechecked.

Keto, carnivore, and intermittent-fasting education is available; restrictive prescriptions and medicine changes are not generated. Selected pregnancy, diabetes/medicine, kidney/heart, injury/rehabilitation, and eating-disorder contexts require individual professional review before automatic planning.

## Movement and accessibility

Exercise references provide starting cues and setup alternatives, not an individualized form assessment or rehabilitation prescription. A diagnosis or disability label alone does not determine suitability. Functional preferences support discovery; qualified review is still needed for individual restrictions. Gender identity alone does not determine exercise suitability.

## Reporting concerns

Use [security reporting](../SECURITY.md) for privacy/security defects. Content corrections can use a normal issue with the disputed statement and a primary source; do not include private health information.
