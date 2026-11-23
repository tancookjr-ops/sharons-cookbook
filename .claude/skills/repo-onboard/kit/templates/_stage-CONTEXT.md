# [[stage.slug]] — [[stage.job]]

One job: [[stage.job]].

## Inputs
- Working (this run): [[stage.input]]
- Reference (every run): `[[stage.up]]_shared/rules.md` §3 (content rules)
- Reference (every run): {{FILL: the factory file this stage follows — e.g. a structure or style guide}}

Do NOT load: {{FILL: what an eager agent would wrongly pull in}}.

## Process
1. Read the inputs.
2. {{FILL: the transformation, one numbered line per action}}
3. Write the result to `output/`.

## Outputs
- {{FILL: artifact name}} → `output/`

## Human check
[[stage.check]]
