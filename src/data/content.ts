// Canonical content for Sons of Disparity.
// This module is the single source of truth for narrative + statistical content.
// - The Worker serves it as a fallback whenever D1 is empty or unavailable.
// - The client uses it as a fallback whenever the API is unreachable.
// - scripts/generate-seed.mjs converts it into src/db/seed.sql for D1.
//
// Ethical guardrail: the system is on trial. Not the neighborhood.
// Not the mother. Not the boy.

import type { Source, Statistic, StoryAct, VideoScene, VideoSceneStatistic } from '../types'

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const SOURCES: Source[] = [
  {
    id: 'src-census',
    title: 'Poverty in the United States: 2023',
    publisher: 'U.S. Census Bureau',
    url: 'https://www.census.gov/library/publications/2024/demo/p60-283.html',
    year: 2024,
    methodology_note:
      'Current Population Survey ASEC estimates. The official and supplemental poverty measures produce different levels, but the Black–white child poverty gap is stable across both measures and across decades.',
  },
  {
    id: 'src-sharkey',
    title: 'Stuck in Place: Urban Neighborhoods and the End of Progress toward Racial Equality',
    publisher: 'University of Chicago Press (Patrick Sharkey)',
    url: 'https://press.uchicago.edu/ucp/books/book/chicago/S/bo14365260.html',
    year: 2013,
    methodology_note:
      'Longitudinal analysis of the Panel Study of Income Dynamics, following families across generations. “High-poverty neighborhood” means a census tract with a poverty rate of 20% or more.',
  },
  {
    id: 'src-ocr',
    title: 'Civil Rights Data Collection: School Discipline',
    publisher: 'U.S. Department of Education, Office for Civil Rights',
    url: 'https://ocrdata.ed.gov/',
    year: 2021,
    methodology_note:
      'Administrative data reported by nearly every U.S. public school. It records discipline events, not underlying behavior — but studies that control for the type of infraction still find Black students disciplined more harshly for similar conduct.',
  },
  {
    id: 'src-csg',
    title: 'Breaking Schools’ Rules: A Statewide Study of How School Discipline Relates to Students’ Success',
    publisher: 'Council of State Governments Justice Center',
    url: 'https://csgjusticecenter.org/publications/breaking-schools-rules/',
    year: 2011,
    methodology_note:
      'Cohort study of nearly one million Texas students followed for six years, controlling for 83 student and campus variables. Correlational: it cannot fully rule out unobserved differences, but the controls are unusually extensive.',
  },
  {
    id: 'src-sentencing-project',
    title: 'Report to the United Nations on Racial Disparities in the U.S. Criminal Justice System',
    publisher: 'The Sentencing Project',
    url: 'https://www.sentencingproject.org/reports/report-to-the-united-nations-on-racial-disparities-in-the-u-s-criminal-justice-system/',
    year: 2018,
    methodology_note:
      'Synthesis of FBI Uniform Crime Reporting and Bureau of Justice Statistics data. Arrest-rate ratios reflect police contact, which is shaped by deployment and enforcement priorities as well as by offending.',
  },
  {
    id: 'src-stanford',
    title: 'A large-scale analysis of racial disparities in police stops across the United States',
    publisher: 'Nature Human Behaviour (Stanford Open Policing Project)',
    url: 'https://www.nature.com/articles/s41562-020-0858-1',
    year: 2020,
    methodology_note:
      'Analysis of nearly 100 million traffic stops. Search “hit rates” were lower for Black drivers than white drivers — evidence that the bar for searching Black drivers was lower, not that offending was higher.',
  },
  {
    id: 'src-berdejo',
    title: 'Criminalizing Race: Racial Disparities in Plea-Bargaining',
    publisher: 'Boston College Law Review (Carlos Berdejó)',
    url: 'https://lawdigitalcommons.bc.edu/bclr/vol59/iss4/2/',
    year: 2018,
    methodology_note:
      'Analysis of every case filed in Wisconsin circuit courts over seven years — roughly 30,000 cases — comparing defendants facing the same initial charge with no prior record. Single-state data; the direction of the finding is consistent with multi-state studies.',
  },
  {
    id: 'src-rehavi-starr',
    title: 'Racial Disparity in Federal Criminal Sentences',
    publisher: 'Journal of Political Economy (M. Marit Rehavi & Sonja B. Starr)',
    url: 'https://www.journals.uchicago.edu/doi/10.1086/677255',
    year: 2014,
    methodology_note:
      'Links federal cases from arrest through sentencing, controlling for arrest offense and criminal history. Roughly half of the remaining sentence gap is explained by prosecutors’ initial charging decisions — especially charges carrying mandatory minimums.',
  },
  {
    id: 'src-dobbie',
    title: 'The Effects of Pre-Trial Detention on Conviction, Future Crime, and Employment',
    publisher: 'American Economic Review (Dobbie, Goldin & Yang)',
    url: 'https://www.aeaweb.org/articles?id=10.1257/aer.20161503',
    year: 2018,
    methodology_note:
      'Quasi-experimental design exploiting the effectively random assignment of bail judges. The conviction effect is driven almost entirely by increased guilty pleas among detained defendants.',
  },
  {
    id: 'src-bjs-prevalence',
    title: 'Prevalence of Imprisonment in the U.S. Population, 1974–2001',
    publisher: 'Bureau of Justice Statistics (Thomas P. Bonczar)',
    url: 'https://bjs.ojp.gov/library/publications/prevalence-imprisonment-us-population-1974-2001',
    year: 2003,
    methodology_note:
      'Lifetime-likelihood projection based on 2001 incarceration rates. Incarceration has declined since, so the realized rate for the 2001 birth cohort will be lower than projected — the racial disparity ratio, however, has persisted.',
  },
  {
    id: 'src-bjs-recidivism',
    title: 'Recidivism of Prisoners Released: 5-Year Follow-Up Studies',
    publisher: 'Bureau of Justice Statistics',
    url: 'https://bjs.ojp.gov/library/publications/recidivism-prisoners-released-34-states-2012-5-year-follow-period-2012-2017',
    year: 2021,
    methodology_note:
      'Five-year rearrest rates range from roughly 68% to 77% across BJS release cohorts. Rearrest is not reconviction: it measures renewed police contact, which is itself shaped by supervision intensity and policing patterns.',
  },
  {
    id: 'src-pager',
    title: 'The Mark of a Criminal Record',
    publisher: 'American Journal of Sociology (Devah Pager)',
    url: 'https://www.journals.uchicago.edu/doi/10.1086/374403',
    year: 2003,
    methodology_note:
      'Matched-pair audit study using trained testers with identical résumés in Milwaukee. Replicated in New York City in 2004 with consistent results. Audit studies measure employer behavior directly rather than inferring it from surveys.',
  },
  {
    id: 'src-ppi',
    title: 'Out of Prison & Out of Work: Unemployment among formerly incarcerated people',
    publisher: 'Prison Policy Initiative',
    url: 'https://www.prisonpolicy.org/reports/outofwork.html',
    year: 2018,
    methodology_note:
      'Based on the National Former Prisoner Survey (2008) — the most recent national estimate available. The 27% unemployment rate exceeds the overall U.S. rate at any point in history, including the Great Depression.',
  },
  {
    id: 'src-aecf',
    title: 'A Shared Sentence: The Devastating Toll of Parental Incarceration on Kids, Families and Communities',
    publisher: 'The Annie E. Casey Foundation',
    url: 'https://www.aecf.org/resources/a-shared-sentence',
    year: 2016,
    methodology_note:
      'Cumulative childhood prevalence estimated from the National Survey of Children’s Health. Measures whether a child has ever had a resident parent incarcerated, not current incarceration.',
  },
  {
    id: 'src-rand',
    title: 'Evaluating the Effectiveness of Correctional Education',
    publisher: 'RAND Corporation',
    url: 'https://www.rand.org/pubs/research_reports/RR266.html',
    year: 2013,
    methodology_note:
      'Meta-analysis of 30 years of correctional-education studies commissioned by the U.S. Department of Justice. The 43% figure is reduced odds of recidivating among participants; selection into programs is a known limitation the study weights for.',
  },
  {
    id: 'src-ussc',
    title: 'Demographic Differences in Sentencing',
    publisher: 'U.S. Sentencing Commission',
    url: 'https://www.ussc.gov/research/research-reports/demographic-differences-sentencing',
    year: 2023,
    methodology_note:
      'Multivariate regression of federal sentences controlling for guideline factors. The Commission’s estimated Black–white sentence gap for similarly situated men has ranged from about 10% to 20% across report periods and specifications.',
  },
  {
    id: 'src-nber-wealth',
    title: 'The Wealth of Two Nations: The U.S. Racial Wealth Gap, 1860–2020',
    publisher: 'Quarterly Journal of Economics (Derenoncourt, Kim, Kuhn & Schularick)',
    url: 'https://www.nber.org/papers/w30101',
    year: 2024,
    methodology_note:
      'Reconstructs 160 years of Black and white wealth from census, tax, and survey records. The white-to-Black per-capita wealth ratio fell from roughly 60:1 at emancipation, converged at about 1.5% per year through 1980 — then stopped converging and began widening again. The counterfactual with equal wealth-accumulating conditions since emancipation is roughly 3:1; the observed ratio is about 6:1.',
  },
  {
    id: 'src-census-wealth',
    title: 'The Wealth of Households: 2021',
    publisher: 'U.S. Census Bureau',
    url: 'https://www.census.gov/library/publications/2023/demo/p70br-183.html',
    year: 2023,
    methodology_note:
      'Survey of Income and Program Participation (SIPP) tabulations. Median household wealth: $250,400 for white householders vs. $24,520 for Black householders. Medians understate the gap at the top — mean gaps are larger. White households (about 65% of households) hold roughly 80% of all wealth; Black households (13.6%) hold 4.7%.',
  },
  {
    id: 'src-hrw-drugs',
    title: 'Punishment and Prejudice: Racial Disparities in the War on Drugs',
    publisher: 'Human Rights Watch',
    url: 'https://www.hrw.org/reports/2000/usa/',
    year: 2000,
    methodology_note:
      'State prison admission data from the height of the drug war. Black men were admitted to state prison on drug charges at 13 times the white male rate nationally; in seven states Black people were 80–90% of drug admissions. National survey data (NHSDA) showed drug use rates that were similar across races — the disparity is in enforcement, not use.',
  },
  {
    id: 'src-sentencing-onein5',
    title: 'One in Five: Racial Disparity in Imprisonment — Causes and Consequences',
    publisher: 'The Sentencing Project',
    url: 'https://www.sentencingproject.org/reports/one-in-five-racial-disparity-in-imprisonment-causes-and-consequences/',
    year: 2023,
    methodology_note:
      'Updates the lifetime-imprisonment estimate using current (not 2001) incarceration rates: roughly 1 in 5 Black men born in 2001, down from the 1-in-3 projection made at their birth. Progress is real and stated plainly — and the remaining disparity is still roughly four times the white rate.',
  },
  {
    id: 'src-nrc-growth',
    title: 'The Growth of Incarceration in the United States: Exploring Causes and Consequences',
    publisher: 'National Research Council',
    url: 'https://nap.nationalacademies.org/catalog/18613/the-growth-of-incarceration-in-the-united-states-exploring-causes',
    year: 2014,
    methodology_note:
      'Consensus study of the National Academies. Documents the historical arc: the Black male incarceration rate roughly tripled between 1970 (~600 per 100,000) and 2000 (~1,800 per 100,000) as drug-war statutes, mandatory minimums, and truth-in-sentencing laws took hold.',
  },
  {
    id: 'src-harpers-ehrlichman',
    title: 'Legalize It All (the Ehrlichman interview)',
    publisher: 'Harper’s Magazine (Dan Baum)',
    url: 'https://harpers.org/archive/2016/04/legalize-it-all/',
    year: 2016,
    methodology_note:
      'Quote from a 1994 interview with Nixon domestic-policy advisor John Ehrlichman, published by Baum in 2016. Treat with care: Ehrlichman died in 1999, his family disputes the quote, and some historians read it as embittered exaggeration. It is presented here as a contested confession — the enforcement statistics stand on their own with or without it.',
  },
]

// ---------------------------------------------------------------------------
// Statistics (act_number 0 = Compare Lives calculator inputs)
// ---------------------------------------------------------------------------

export const STATISTICS: Statistic[] = [
  // --- Act 1 — Before He Has a Name
  {
    id: 'st-a1-poverty',
    act_number: 1,
    slug: 'black-child-poverty',
    short_claim: 'Black child poverty rate',
    value_text: '28.5%',
    detail_text:
      'Roughly 28.5% of Black children in the United States live below the poverty line — nearly three times the rate for white children.',
    source_id: 'src-census',
    skeptic_caveat:
      'Poverty measures vary (official vs. supplemental) and shift year to year. The roughly 3-to-1 gap between Black and white child poverty is stable across measures and across decades.',
    display_style: 'card',
  },
  {
    id: 'st-a1-neighborhood',
    act_number: 1,
    slug: 'neighborhood-poverty',
    short_claim: 'raised in high-poverty neighborhoods',
    value_text: '66% vs 6%',
    detail_text:
      'Two-thirds of Black children raised between 1985 and 2000 grew up in high-poverty neighborhoods. For white children: about 6%.',
    source_id: 'src-sharkey',
    skeptic_caveat:
      '“High-poverty” means a census tract with a 20%+ poverty rate. The estimate comes from the PSID, a longitudinal panel — it tracks the same families for decades, but panels can underrepresent the most transient households.',
    display_style: 'card',
  },

  // --- Act 2 — The Hallway
  {
    id: 'st-a2-suspension',
    act_number: 2,
    slug: 'suspension-disparity',
    short_claim: 'more likely to be suspended',
    value_text: '3.6×',
    detail_text:
      'Black students are 3.6 times more likely than white students to receive one or more out-of-school suspensions. The gap appears as early as preschool.',
    source_id: 'src-ocr',
    skeptic_caveat:
      'Administrative data records discipline events, not behavior. But studies that control for the specific infraction still find Black students punished more severely for similar conduct — the gap is largest for subjective offenses like “defiance.”',
    display_style: 'card',
  },
  {
    id: 'st-a2-pipeline',
    act_number: 2,
    slug: 'suspension-to-justice',
    short_claim: 'more likely to touch the justice system after suspension',
    value_text: '2.85×',
    detail_text:
      'Students suspended or expelled for a discretionary violation were nearly three times more likely to be in contact with the juvenile justice system the following year.',
    source_id: 'src-csg',
    skeptic_caveat:
      'Correlational cohort study of nearly one million Texas students with 83 controls. It cannot fully rule out selection effects — but the discretionary/non-discretionary comparison is designed to isolate the school’s choice.',
    display_style: 'card',
  },

  // --- Act 3 — The Stop
  {
    id: 'st-a3-arrest',
    act_number: 3,
    slug: 'arrest-disparity',
    short_claim: 'more likely to be arrested',
    value_text: '2.8×',
    detail_text:
      'Black Americans are arrested at roughly 2.8 times the rate of white Americans.',
    source_id: 'src-sentencing-project',
    skeptic_caveat:
      'Arrest rates measure police contact, not just offending. Self-report surveys show much smaller racial differences in underlying behavior for common offenses — especially drug offenses, where use rates are similar.',
    display_style: 'card',
  },
  {
    id: 'st-a3-search',
    act_number: 3,
    slug: 'search-disparity',
    short_claim: 'more likely to be searched at a traffic stop',
    value_text: '~2×',
    detail_text:
      'Across nearly 100 million analyzed traffic stops, Black drivers were stopped more often and searched at roughly twice the rate of white drivers.',
    source_id: 'src-stanford',
    skeptic_caveat:
      'The study’s key check: searches of Black drivers turned up contraband less often. A lower “hit rate” means the evidentiary bar for searching Black drivers was lower — the disparity is in the standard applied, not the behavior found.',
    display_style: 'card',
  },

  // --- Act 4 — The Plea (feeds TheSameMistake)
  {
    id: 'st-a4-charge-reduction',
    act_number: 4,
    slug: 'plea-charge-reduction',
    short_claim: 'chance the top charge gets reduced or dropped',
    value_text: '63.9% vs 50.7%',
    detail_text:
      'Among defendants facing the same initial charge with no prior record, white defendants had their most serious charge reduced or dropped 63.9% of the time. Black defendants: 50.7% — a 25% relative gap.',
    source_id: 'src-berdejo',
    skeptic_caveat:
      'Wisconsin circuit-court data (~30,000 cases over seven years). Single-state, but one of the only datasets that observes the initial charge, the final charge, and prior record together.',
    display_style: 'fork',
  },
  {
    id: 'st-a4-misdemeanor',
    act_number: 4,
    slug: 'plea-misdemeanor-jail',
    short_claim: 'more often avoids a jail-carrying conviction (same misdemeanor)',
    value_text: '75%',
    detail_text:
      'In misdemeanor cases, white defendants were roughly 75% more likely than Black defendants to be convicted of nothing that carried possible incarceration — or nothing at all.',
    source_id: 'src-berdejo',
    skeptic_caveat:
      'Same Wisconsin dataset as the charge-reduction figure. The gap is largest precisely where prosecutors have the most discretion and the least information: low-level first offenses.',
    display_style: 'fork',
  },
  {
    id: 'st-a4-sentence',
    act_number: 4,
    slug: 'plea-sentence-length',
    short_claim: 'longer federal sentences for the same arrest offense',
    value_text: '~10%',
    detail_text:
      'Conditional on the same arrest offense and criminal history, Black men receive federal sentences roughly 10% longer than white men. About half the gap traces to prosecutors’ initial charging decisions.',
    source_id: 'src-rehavi-starr',
    skeptic_caveat:
      'Federal cases only; state systems vary. The U.S. Sentencing Commission’s own regressions have estimated gaps between about 10% and 20% depending on period and specification.',
    display_style: 'fork',
  },
  {
    id: 'st-a4-detention',
    act_number: 4,
    slug: 'pretrial-detention-conviction',
    short_claim: 'higher chance of conviction when detained pretrial',
    value_text: '+13%',
    detail_text:
      'Being detained before trial — usually for inability to pay bail — raises the likelihood of conviction by about 13 percentage points, driven almost entirely by guilty pleas.',
    source_id: 'src-dobbie',
    skeptic_caveat:
      'Quasi-experimental: uses the random assignment of bail judges as a natural experiment, so the effect is causal for marginal cases, not a simple correlation.',
    display_style: 'card',
  },

  // --- Act 5 — The Count
  {
    id: 'st-a5-lifetime',
    act_number: 5,
    slug: 'lifetime-imprisonment',
    short_claim: 'Black boys born in 2001 projected to be imprisoned in their lifetime',
    value_text: '1 in 3',
    detail_text:
      'At the incarceration rates of 2001 — the year Deon was born — 1 in 3 Black boys could expect to be imprisoned in his lifetime. For white boys: 1 in 17.',
    source_id: 'src-bjs-prevalence',
    skeptic_caveat:
      'A projection from 2001 rates, not a measured outcome. Incarceration has fallen since: The Sentencing Project’s 2023 update puts the lifetime likelihood for this cohort at roughly 1 in 5 — lower, and still about four times the white rate. Act VII uses the updated number.',
    display_style: 'card',
  },
  {
    id: 'st-a5-mandmin',
    act_number: 5,
    slug: 'mandatory-minimum',
    short_claim: 'more likely to be charged with a mandatory-minimum offense',
    value_text: '1.75×',
    detail_text:
      'For the same underlying arrest conduct, federal prosecutors were 1.75 times more likely to file charges carrying a mandatory minimum sentence against Black defendants.',
    source_id: 'src-rehavi-starr',
    skeptic_caveat:
      'Controls for arrest offense, criminal history, district, and demographics. Charging is where the discretion lives: the mandatory minimum is chosen before any judge is involved.',
    display_style: 'card',
  },
  {
    id: 'st-a5-recidivism',
    act_number: 5,
    slug: 'five-year-rearrest',
    short_claim: 'of released prisoners rearrested within five years',
    value_text: '72.7%',
    detail_text:
      'Roughly seven in ten people released from state prison are rearrested within five years. The system Deon leaves is engineered to receive him back.',
    source_id: 'src-bjs-recidivism',
    skeptic_caveat:
      'Rearrest, not reconviction — it measures renewed police contact. Five-year rearrest ranges from about 68% to 77% across BJS release cohorts; supervision intensity itself generates arrests (technical violations).',
    display_style: 'card',
  },

  // --- Act 6 — The Box
  {
    id: 'st-a6-callback',
    act_number: 6,
    slug: 'callback-rate',
    short_claim: 'callback rate: Black applicant with a record',
    value_text: '5%',
    detail_text:
      'In matched-pair hiring audits, white applicants WITH a felony record were called back 17% of the time — more often than Black applicants WITHOUT one (14%). Black applicants with a record: 5%.',
    source_id: 'src-pager',
    skeptic_caveat:
      'Milwaukee, 2001, entry-level jobs, trained testers with identical résumés. Replicated in New York City in 2004 with the same pattern. Audit studies measure what employers do, not what they say.',
    display_style: 'card',
  },
  {
    id: 'st-a6-unemployment',
    act_number: 6,
    slug: 'formerly-incarcerated-unemployment',
    short_claim: 'unemployment among formerly incarcerated people',
    value_text: '27%',
    detail_text:
      'Higher than the U.S. unemployment rate at any point in recorded history, including the Great Depression. For formerly incarcerated Black women: 43.6%.',
    source_id: 'src-ppi',
    skeptic_caveat:
      'Based on the 2008 National Former Prisoner Survey — the most recent national estimate. Counts only people actively looking for work; discouraged non-seekers are excluded from both numerator and denominator.',
    display_style: 'card',
  },

  // --- Act 7 — The Cross-Examination
  {
    id: 'st-a7x-wealth-ratio',
    act_number: 7,
    slug: 'wealth-ratio-today',
    short_claim: 'median white vs Black household wealth',
    value_text: '10:1',
    detail_text:
      '$250,400 to $24,520. Before any choice Deon ever made, the cushion under him was one-tenth the size — the margin that absorbs a bad year, a bail bond, a first mistake.',
    source_id: 'src-census-wealth',
    skeptic_caveat:
      'Median household wealth from Census SIPP tabulations (2021). Medians are the conservative choice: mean gaps are larger. Per-capita estimates put the ratio near 6:1.',
    display_style: 'card',
  },
  {
    id: 'st-a7x-wealth-reversal',
    act_number: 7,
    slug: 'wealth-gap-reversal',
    short_claim: 'the year the racial wealth gap stopped closing',
    value_text: '1980',
    detail_text:
      'From emancipation to 1980 the gap converged — about 1.5% a year through the civil-rights era. Since 1980 it has widened. Had conditions been equal for 150 years, the ratio would be near 3:1. It is roughly 6:1.',
    source_id: 'src-nber-wealth',
    skeptic_caveat:
      '160 years of reconstructed wealth data (census, tax, and survey records). The reversal is not a projection — it is the observed trend since 1980, the same decades the drug war built.',
    display_style: 'card',
  },
  {
    id: 'st-a7x-drug-13x',
    act_number: 7,
    slug: 'drug-imprisonment-13x',
    short_claim: 'rate Black men were imprisoned for drugs vs white men',
    value_text: '13×',
    detail_text:
      'At the height of the War on Drugs, Black men entered state prison on drug charges at 13 times the white rate. In seven states, 80–90% of the people sent to prison for drugs were Black. Drug use rates, by survey, were similar.',
    source_id: 'src-hrw-drugs',
    skeptic_caveat:
      '1996 state admissions data. The ratio has narrowed since — and remains a multiple, not a margin. The behavior was shared; the punishment was not.',
    display_style: 'card',
  },
  {
    id: 'st-a7x-tripled',
    act_number: 7,
    slug: 'incarceration-tripled',
    short_claim: 'growth of the Black male incarceration rate, 1970–2000',
    value_text: '3×',
    detail_text:
      'Roughly 600 per 100,000 in 1970. Roughly 1,800 by 2000. The signs came down in the sixties; the statutes went up in the eighties.',
    source_id: 'src-nrc-growth',
    skeptic_caveat:
      'National Academies consensus figures. White incarceration also rose — the ratio between the two stayed between roughly 5:1 and 8:1 throughout.',
    display_style: 'card',
  },
  {
    id: 'st-a7x-onein5',
    act_number: 7,
    slug: 'lifetime-one-in-five',
    short_claim: 'Black men born in 2001 likely to be imprisoned — current estimate',
    value_text: '1 in 5',
    detail_text:
      'The updated estimate, using today’s rates instead of 2001’s. Better than the 1-in-3 projected at Deon’s birth — real progress, honestly stated. And still roughly four times the odds his white counterpart carries.',
    source_id: 'src-sentencing-onein5',
    skeptic_caveat:
      'This figure replaces the older 1-in-3 projection with current methodology — cited here deliberately, because the argument does not need the bigger number to stand.',
    display_style: 'card',
  },

  // --- Act 8 — The Nursery
  {
    id: 'st-a7-parent',
    act_number: 8,
    slug: 'parental-incarceration',
    short_claim: 'Black children who have had a parent incarcerated',
    value_text: '1 in 9',
    detail_text:
      'One in nine Black children has had a parent behind bars. The record does not stop at the person it names.',
    source_id: 'src-aecf',
    skeptic_caveat:
      'Cumulative childhood prevalence from the National Survey of Children’s Health — whether a resident parent was ever incarcerated, not a point-in-time count.',
    display_style: 'card',
  },
  {
    id: 'st-a7-education',
    act_number: 8,
    slug: 'correctional-education',
    short_claim: 'lower odds of returning to prison with correctional education',
    value_text: '43%',
    detail_text:
      'People who participate in education programs while incarcerated have 43% lower odds of recidivating. The single most reliable lever the data offers is also the quietest one.',
    source_id: 'src-rand',
    skeptic_caveat:
      'Meta-analysis of 30 years of studies. Selection is the known limitation — people who enroll differ from people who don’t — and the analysis weights study quality to account for it.',
    display_style: 'card',
  },

  // --- Compare Lives calculator (act_number 0)
  {
    id: 'st-cl-poverty',
    act_number: 0,
    slug: 'compare-poverty',
    short_claim: 'childhood below the poverty line',
    value_text: '≈3×',
    detail_text:
      'Black children are nearly three times more likely than white children to grow up below the poverty line, and eleven times more likely to grow up in a high-poverty neighborhood.',
    source_id: 'src-census',
    skeptic_caveat:
      'Poverty is a structural exposure, not a behavior. These figures describe the distribution of childhood conditions, not any individual family.',
    display_style: 'calculator',
  },
  {
    id: 'st-cl-discipline',
    act_number: 0,
    slug: 'compare-discipline',
    short_claim: 'school discipline exposure',
    value_text: '2.85×',
    detail_text:
      'A discretionary suspension nearly triples the odds of juvenile-justice contact within a year — and Black students are 3.6× more likely to be suspended in the first place.',
    source_id: 'src-csg',
    skeptic_caveat:
      'The Texas cohort study controls for 83 variables but remains correlational. The 3.6× suspension disparity is national administrative data.',
    display_style: 'calculator',
  },
  {
    id: 'st-cl-bail',
    act_number: 0,
    slug: 'compare-bail',
    short_claim: 'pretrial detention effect',
    value_text: '+13%',
    detail_text:
      'Defendants who cannot afford bail are about 13 percentage points more likely to be convicted — almost entirely through guilty pleas — and suffer lasting employment losses.',
    source_id: 'src-dobbie',
    skeptic_caveat:
      'Causal estimate from random judge assignment. The mechanism is leverage: detention makes pleading out the fastest way home.',
    display_style: 'calculator',
  },
  {
    id: 'st-cl-charge',
    act_number: 0,
    slug: 'compare-charge',
    short_claim: 'felony record employment penalty',
    value_text: '5% vs 17%',
    detail_text:
      'A felony record cuts a Black applicant’s callback rate to 5% — less than a third of the rate for a white applicant with the identical record (17%).',
    source_id: 'src-pager',
    skeptic_caveat:
      'Matched-pair audit data. For misdemeanors, the plea-bargaining stage is where the disparity concentrates: white defendants avoid jail-carrying convictions ~75% more often.',
    display_style: 'calculator',
  },
]

// ---------------------------------------------------------------------------
// Story acts
// ---------------------------------------------------------------------------

const p = (...paras: string[]) => paras.join('\n\n')

// Acts and cinema scenes share slugs (acts 1-7 ↔ scenes 2-8), so every act's
// background loop and poster derive from the matching scene asset.
const ACTS_BASE: StoryAct[] = [
  {
    id: 'act-1',
    act_number: 1,
    slug: 'before-he-has-a-name',
    title: 'Before He Has a Name',
    subtitle: '2001',
    body_mdx: p(
      'The boy was called Deon. He was born in 2001, in an apartment on the north side of a city that looked like a lot of American cities — old industry, new neglect, neighborhoods where the map turns gray.',
      'His grandmother called him watchful. She meant it as a compliment.',
      'He watched everything from the window of the apartment where four people lived in three rooms. He watched the block below, which was beautiful and dangerous in the way that blocks like that are always both.',
      'Nothing about him was decided yet. That is the thing to hold onto. He was a baby in a blanket with a name his mother chose because it sounded like a bell.',
      'But a file had already been opened. Not on him — around him. The census tract. The school zone. The distance to the nearest grocery store, and the shorter distance to the nearest precinct. The odds were assembled before he had a name.'
    ),
    lenis_lerp: 0.1,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'dark',
  },
  {
    id: 'act-2',
    act_number: 2,
    slug: 'the-hallway',
    title: 'The Hallway',
    subtitle: '2013 — seventh grade',
    body_mdx: p(
      'The first time the system wrote Deon’s name down, he was twelve. He had pushed a boy who had pushed him first. Both things were true; only one was recorded.',
      'The suspension was three days. His mother took an unpaid shift off to sit across from a vice principal who kept saying the word “pattern” about a child who had no pattern.',
      'Deon was not suspended because he was worse than other boys. The data is blunt about this: he was suspended because of how the same behavior gets read on different children.',
      'Three days is not long. But a discipline file is a door, and doors like that open in one direction. The next hallway incident would not start from zero. Nothing in his life would start from zero again.'
    ),
    lenis_lerp: 0.1,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'dark',
  },
  {
    id: 'act-3',
    act_number: 3,
    slug: 'the-stop',
    title: 'The Stop',
    subtitle: '2019 — nineteen years old',
    body_mdx: p(
      'It was a Tuesday in June and the tail light was out. That part is not in dispute.',
      'Deon was nineteen, driving his cousin’s car to a job interview — a warehouse, second shift, twelve dollars an hour. He had printed his résumé at the library. It was on the passenger seat when the lights came on behind him.',
      'The stop took forty minutes. The search took ten. The bag under the passenger seat was his cousin’s; the arrest was his. A first arrest, at nineteen, with a résumé on the seat.',
      'He did what the data says happens: he became a number in the column where boys like him are 2.8 times more likely to appear. Not because the numbers know him. Because the system that produced the numbers had already met a thousand boys it decided were him.'
    ),
    lenis_lerp: 0.1,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'dark',
  },
  {
    id: 'act-4',
    act_number: 4,
    slug: 'the-plea',
    title: 'The Plea',
    subtitle: 'The same mistake',
    body_mdx: p(
      'The public defender had eleven minutes. He was good — tired-good, the way people are good at jobs designed to be impossible. He laid out the arithmetic: fight it and risk years, or take the deal and take the record.',
      'Deon could not afford bail. He had been inside for nineteen days, and the warehouse job was gone, and every day inside made the deal look more like a door.',
      'Here the story has to stop being one story. Because somewhere in the same state, in the same June, a boy the same age with the same charge and the same empty record sat in a different room — out on bail his parents posted — and the arithmetic ran differently.',
      'Same mistake. Different math. The fork below is not a metaphor. It is measured.'
    ),
    lenis_lerp: 0.1,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'dark',
  },
  {
    id: 'act-5',
    act_number: 5,
    slug: 'the-count',
    title: 'The Count',
    subtitle: 'Thirty-one months',
    body_mdx: p(
      'Time moves differently inside. That is not a saying; it is a policy. The count happens four times a day, and between counts, time is something done to you.',
      'Deon was one of the 1 in 3 — the projection published two years after he was born, as if the state had drafted a schedule for him and then waited.',
      'He read. There was a class, sometimes, when there was funding, which was sometimes. He wrote letters to his mother in handwriting that got smaller every month, as if he were making himself easier to store.',
      'The walls here are not a metaphor either. The scroll slows down because he cannot make it go faster. Neither can you.'
    ),
    lenis_lerp: 0.03,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'desaturated',
  },
  {
    id: 'act-6',
    act_number: 6,
    slug: 'the-box',
    title: 'The Box',
    subtitle: 'After',
    body_mdx: p(
      'They give you your shoes back, and a bus ticket, and a paper that proves where you have been to anyone who asks. Everyone asks.',
      'The application at the second warehouse was two pages. The box was on page one, above his name, as if the record were the applicant and Deon the attachment.',
      'Have you ever been convicted of a felony? The box does not ask what happened, or what the public defender had eleven minutes to explain, or what a nineteen-day wait in county does to arithmetic. The box holds one bit of information and it is enough.',
      'He checked it, because lying is a crime and he was done committing those. Then he waited by a phone that the data says would ring for one applicant in twenty who looked like him.'
    ),
    lenis_lerp: 0.1,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'dark',
  },
  {
    id: 'act-7x',
    act_number: 7,
    slug: 'the-cross-examination',
    title: 'The Cross-Examination',
    subtitle: 'The voice that says he should have done better',
    body_mdx: p(
      'There is a voice that has been reading over your shoulder since Act One. It is patient and reasonable and it says: plenty of people grow up poor and never see a cell. He should have done better. Say it out loud — it deserves a real answer, not a wince.',
      'So run the cross-examination. Not of Deon — of the voice. Start with the cushion. From emancipation until 1980, the wealth gap between Black and white America was actually closing, about 1.5% a year through the civil-rights era. Then it stopped. Since 1980 — the decades Deon’s mother was working double shifts, the decades the drug war was built — it has widened. That is not slavery-era residue. That is a reversal, in living memory, on our watch.',
      'Now the enforcement. At the height of the War on Drugs, Black men were sent to state prison on drug charges at thirteen times the rate of white men — for behavior the surveys say both groups did at similar rates. In seven states, eight or nine of every ten people imprisoned for drugs were Black. The Black male incarceration rate tripled between 1970 and 2000. The signs that said whites only came down; the statutes went up. The tools changed. The damage learned to fill out paperwork.',
      'Be precise about what this chapter does not claim. It does not claim nothing improved — life expectancy rose, the lifetime-imprisonment estimate for Deon’s generation has fallen from one in three to one in five, and both facts are stated here plainly. The claim is narrower and harder: the machinery became less visible, more administratively normalized, and still devastating. A record does today what a sign did then, and the record never has to mention race.',
      'Now the mirror. Keep everything you are proud of — your intelligence, your discipline, your faith, your mother’s love. Remove only the cushion. Give yourself one-tenth the wealth behind you, the hallway that records you, the stop that searches you, the bail you cannot post, the plea math that runs against you, the charge filed heavier. Stack them, one by one, below.',
      'If you cannot say with certainty that you would have come through untouched, then “do better” was never an explanation. It was an excuse — a system counting on distance, so the comfortable could call structural injury a character flaw.'
    ),
    lenis_lerp: 0.08,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'dark',
  },
  {
    id: 'act-7',
    act_number: 8,
    slug: 'the-nursery',
    title: 'The Nursery',
    subtitle: '2026',
    body_mdx: p(
      'The boy was called Marcus. He was born in 2026, in a small apartment with a window, to a father who watched him the way his own grandmother once described: watchful, and meaning it as a compliment.',
      'Deon works nights and studies mornings. The class he started inside became a certificate outside — the one lever the data ever agreed on. The record follows him still. But he is carrying it now, instead of it carrying him.',
      'There is a plant on the windowsill of the nursery. It is small and stubborn and green — the first green thing in this story, which was not an accident of light.',
      'Marcus’s file is empty. Whether it stays that way is not up to Marcus, and it never was. It is up to the systems this story put on trial — and to the people who can still amend them.',
      'He is not born guilty. The record is open. It is still mostly blank. Hold the pen.'
    ),
    lenis_lerp: 0.1,
    higgsfield_loop_url: null,
    poster_url: null,
    elevenlabs_audio_url: null,
    palette: 'seedling',
  },
]

export const ACTS: StoryAct[] = ACTS_BASE.map((a) =>
  // The cross-examination has no film — the interrogation room stays dark.
  a.slug === 'the-cross-examination'
    ? a
    : {
        ...a,
        higgsfield_loop_url: `/media/scenes/${a.slug}.mp4`,
        poster_url: `/media/posters/${a.slug}.jpg`,
      }
)

// ---------------------------------------------------------------------------
// Video scenes (cinema mode) — Higgsfield loops (kling3_0_turbo, 10s, muted)
// + ElevenLabs narration (via Higgsfield text2speech_v2, voice "Sterling").
// Scene duration = narration length + a breathing tail; the player's master
// clock owns timing and the loop just plays underneath.
// transcript_text doubles as the caption + transcript source.
// ---------------------------------------------------------------------------

const ELEVENLABS_VOICE_ID = 'dc382508-c8bd-443c-8cb2-46e57b8d2e6f' // "Sterling"

const HIGGSFIELD_BASE =
  'Hand-drawn pen and ink illustration animation on aged cream sketchbook paper with worn edges, vintage archival documentary style, crosshatched pen shading, figures rendered as bold solid black ink silhouettes — Black subjects portrayed with dignity and tenderness, never caricature — subtle animated line work, slow gentle camera drift, quiet, humane. No photorealism, no bright colors, no violence, no readable words or lettering'

const scene = (
  n: number,
  slug: string,
  title: string,
  chapter_slug: string,
  duration_seconds: number,
  transcript_text: string,
  sceneDirection: string
): VideoScene => ({
  id: `vs-${n}`,
  slug,
  title,
  chapter_slug,
  sequence: n,
  duration_seconds,
  video_url: `/media/scenes/${slug}.mp4`,
  poster_url: `/media/posters/${slug}.jpg`,
  transcript_text,
  narration_audio_url: `/media/narration/${slug}.mp3`,
  higgsfield_prompt: `${HIGGSFIELD_BASE}. Scene: ${sceneDirection}`,
  elevenlabs_voice_id: ELEVENLABS_VOICE_ID,
  status: 'ready',
})

export const VIDEO_SCENES: VideoScene[] = [
  scene(
    1,
    'the-ledger',
    'The Ledger',
    'prologue',
    
24,
    'This is a story about a boy who does not exist. His name is Deon. We built him out of numbers — and every number is real. Before he has a name, a ledger is already open: where he will live, what his school will do with him, how a traffic stop will go. This film reads the ledger out loud.',
    'A ledger book opening in darkness, pages turning slowly, columns of figures dissolving into a city skyline silhouette at night.'
  ),
  scene(
    2,
    'before-he-has-a-name',
    'Before He Has a Name',
    'act-1',
    
32,
    'Deon is born in 2001, on the north side of a city like a lot of American cities. Four people, three rooms, one window. More than a quarter of Black children in America grow up below the poverty line — nearly three times the rate for white children. Two-thirds grow up in high-poverty neighborhoods. For white children, six percent. Nothing about him is decided yet. But the odds were assembled before he had a name.',
    'A mother holding an infant silhouetted against an apartment window, city block below, streetlight glow, laundry lines, quiet.'
  ),
  scene(
    3,
    'the-hallway',
    'The Hallway',
    'act-2',
    
30,
    'Seventh grade. A push in a hallway — two boys, both pushed, one recorded. Black students are three point six times more likely to be suspended for the same behavior. And a suspension is a door: students suspended for a discretionary offense are nearly three times more likely to touch the juvenile justice system within a year. Three days out of school. Nothing starts from zero again.',
    'A long empty school hallway, lockers in silhouette, a small figure walking away carrying a backpack, fluorescent light pooling.'
  ),
  scene(
    4,
    'the-stop',
    'The Stop',
    'act-3',
    
25,
    'Nineteen years old. A tail light. A résumé on the passenger seat. Black drivers are searched at roughly twice the rate of white drivers — and the searches find less. Black Americans are arrested at two point eight times the rate of white Americans. The stop takes forty minutes. The interview never happens.',
    'A car at night pulled to a curb, headlight beams and long shadows, a paper résumé on a passenger seat, red glow kept off-screen.'
  ),
  scene(
    5,
    'the-plea',
    'The Plea',
    'act-4',
    
38,
    'Two boys. Same age. Same charge. No priors. The white defendant’s top charge is reduced or dropped sixty-three point nine percent of the time. The Black defendant’s: fifty point seven. For the same misdemeanor, the white defendant avoids a jail-carrying conviction seventy-five percent more often. Deon cannot afford bail — and detention raises conviction by thirteen points, almost entirely through guilty pleas. He takes the deal. The same mistake was never the same mistake.',
    'A table splitting the frame in two, two identical silhouetted figures on either side, one door opening and one staying shut, scales implied by light.'
  ),
  scene(
    6,
    'the-count',
    'The Count',
    'act-5',
    
33,
    'Thirty-one months. The count happens four times a day. One in three Black boys born in 2001 was projected to be imprisoned in his lifetime; for white boys, one in seventeen. For the same conduct, prosecutors file mandatory-minimum charges one point seven five times more often against Black defendants. Deon reads. There is a class, when there is funding. Time is something done to him.',
    'Slow pan across a cell block in silhouette, bars casting long parallel shadows, a single figure reading by a small light, desaturated.'
  ),
  scene(
    7,
    'the-box',
    'The Box',
    'act-6',
    
32,
    'They give you your shoes, a bus ticket, and a record. The application asks one question in a box above his name. In matched audits, a white applicant with a felony record gets called back more often than a Black applicant with no record at all. A Black applicant with a record: five percent. Unemployment among the formerly incarcerated is twenty-seven percent — worse than the Great Depression. Deon checks the box, because it is the truth.',
    'A pen hovering over a printed form, an oversized checkbox, a phone on a table that does not ring, window light crossing the frame.'
  ),
  scene(
    8,
    'the-nursery',
    'The Nursery',
    'act-8',
    
37,
    'Twenty twenty-six. A boy named Marcus is born to a father who is watchful, and means it as a compliment. The class Deon started inside became a certificate outside: education in prison cuts the odds of going back by forty-three percent. One in nine Black children has had a parent behind bars — the record follows families. But Marcus’s file is empty. It is still mostly blank. This is the only scene with color in it. Hold the pen.',
    'A nursery at dawn, a father silhouetted holding an infant by a window, a small potted seedling on the sill rendered in muted green — the only color in the film.'
  ),
]

// Timestamps track where each number lands in the ElevenLabs narration.
export const VIDEO_SCENE_STATISTICS: VideoSceneStatistic[] = [
  { video_scene_id: 'vs-2', statistic_id: 'st-a1-poverty', timestamp_start_seconds: 8, timestamp_end_seconds: 15, display_mode: 'overlay' },
  { video_scene_id: 'vs-2', statistic_id: 'st-a1-neighborhood', timestamp_start_seconds: 16, timestamp_end_seconds: 24, display_mode: 'overlay' },
  { video_scene_id: 'vs-3', statistic_id: 'st-a2-suspension', timestamp_start_seconds: 7, timestamp_end_seconds: 13, display_mode: 'overlay' },
  { video_scene_id: 'vs-3', statistic_id: 'st-a2-pipeline', timestamp_start_seconds: 14, timestamp_end_seconds: 22, display_mode: 'overlay' },
  { video_scene_id: 'vs-4', statistic_id: 'st-a3-search', timestamp_start_seconds: 5, timestamp_end_seconds: 11, display_mode: 'overlay' },
  { video_scene_id: 'vs-4', statistic_id: 'st-a3-arrest', timestamp_start_seconds: 12, timestamp_end_seconds: 18, display_mode: 'overlay' },
  { video_scene_id: 'vs-5', statistic_id: 'st-a4-charge-reduction', timestamp_start_seconds: 5, timestamp_end_seconds: 14, display_mode: 'overlay' },
  { video_scene_id: 'vs-5', statistic_id: 'st-a4-misdemeanor', timestamp_start_seconds: 15, timestamp_end_seconds: 21, display_mode: 'overlay' },
  { video_scene_id: 'vs-5', statistic_id: 'st-a4-detention', timestamp_start_seconds: 22, timestamp_end_seconds: 30, display_mode: 'overlay' },
  { video_scene_id: 'vs-6', statistic_id: 'st-a5-lifetime', timestamp_start_seconds: 6, timestamp_end_seconds: 13, display_mode: 'overlay' },
  { video_scene_id: 'vs-6', statistic_id: 'st-a5-mandmin', timestamp_start_seconds: 14, timestamp_end_seconds: 22, display_mode: 'overlay' },
  { video_scene_id: 'vs-7', statistic_id: 'st-a6-callback', timestamp_start_seconds: 6, timestamp_end_seconds: 15, display_mode: 'overlay' },
  { video_scene_id: 'vs-7', statistic_id: 'st-a6-unemployment', timestamp_start_seconds: 16, timestamp_end_seconds: 23, display_mode: 'overlay' },
  { video_scene_id: 'vs-8', statistic_id: 'st-a7-education', timestamp_start_seconds: 8, timestamp_end_seconds: 15, display_mode: 'overlay' },
  { video_scene_id: 'vs-8', statistic_id: 'st-a7-parent', timestamp_start_seconds: 17, timestamp_end_seconds: 25, display_mode: 'overlay' },
]
