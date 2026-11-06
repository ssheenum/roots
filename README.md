# Roots

**Your mother's health history is a great predictor of your health story.**

Roots is a tool to help women understand the reproductive health they inherit. A mother tells her life and health story to a patient interviewer in her own language (Tamil, Hindi or English) and chooses what her daughter sees. The daughter's own cycle data, labs and family history then come together into insights and a plan.

Built for the Code with Claude: Women in AI Hackathon (women's health track).

## The problem

- Many women never talk to their mothers about menopause, periods or pregnancy. Both sides are too shy.
- That history matters: early menopause, breast cancer under 50, preeclampsia and PMOS in a mother are things doctors use to plan screening and care.
- It lives only in the mother's memory, and it's lost when she can no longer tell it.

## The app

| Tab | What it does |
|---|---|
| **Insights** | **Your cycle:** each number gets a verdict in words (Steady, Changing, Ask your doctor, Get care soon) against both *your normal* and the typical adult range. Insight cards explain what changed, rule out common reasons with a short check-in, then suggest 2–3 small steps and cite one source. **Prepare ahead:** what to watch for perimenopause and when to start preparing, using family history without predicting. |
| **Root** (centre) | A chat at the top answers questions about your cycle and your family's health. You can type, talk (voice input), have replies read aloud, or attach an old report, which Claude reads and adds to your tree. Below it is the heart of the app: invite your mother with a shareable link, written in Tamil, Hindi or English. She opens her interview, picks who she talks to (a warm niece, a calm nurse, a friend her age, or her daughter's own words), and chats in Tamil, Hindi or English, then approves every note. |
| **Family** | A visual family tree. You are the crown; your parents and grandparents are the roots. Tap anyone to see their conditions and story, and see health themes across generations. |

Privacy is built in: the mother approves every note before it reaches her daughter, and sensitive topics start out private.

## Running it

It's a single static file. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

Outside Claude, the app runs in **guided mode**: the interview uses scripted questions and sample answers, and the scan and chat features are hidden or show a note. When opened as a Claude artifact, the interview, document scanning and chat use Claude through the artifact `sample` capability.

## Sample data

The app ships with a fictional family (Kavya, 31; her mother Lakshmi, 58; and her grandmother) so every screen works on first load. Use **Settings → Reset sample data** to start over. Data is stored only in your browser's localStorage.

## Sources behind the insights

Every insight card cites exactly one entry from the built-in library (`LIT` in `index.html`). The app never fetches or invents sources; `search_literature(tags)` only picks from this list.

| Topic | Source |
|---|---|
| Typical cycle (24–38 days) and period length (up to 8 days) | [FIGO, Munro et al. 2018](https://doi.org/10.1002/ijgo.12666) |
| Regularity = spread between shortest and longest cycle | [StatPearls: Physiology, Menstrual Cycle](https://www.ncbi.nlm.nih.gov/books/NBK500020/) |
| Bleeding red flags | [ACOG: Abnormal Uterine Bleeding](https://www.acog.org/womens-health/faqs/abnormal-uterine-bleeding) |
| Heavy periods, iron, copper IUD, blood thinners | [ACOG: Heavy Menstrual Bleeding](https://www.acog.org/womens-health/faqs/heavy-menstrual-bleeding) |
| Common reasons for cycle changes | [NHS: Irregular periods](https://www.nhs.uk/symptoms/irregular-periods/), [NHS: Missed or late periods](https://www.nhs.uk/symptoms/missed-or-late-periods/) |
| Rule out other causes before stress | [Nagma et al. 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4413117/), [Endocrine Society FHA guideline 2017](https://academic.oup.com/jcem/article-abstract/102/5/1413/3077281) |
| Stress and cycles | [Nillni et al. 2018](https://doi.org/10.2147/CLEP.S152131) |
| Heart rate and HRV across the cycle | [Alzueta et al. 2022 (Oura)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9005074/) |
| Perimenopause signals and timing | [Harlow et al., STRAW](https://pubmed.ncbi.nlm.nih.gov/17453859/), [Bleeding changes across the transition](https://pmc.ncbi.nlm.nih.gov/articles/PMC3232023/), [NIA: What Is Menopause?](https://www.nia.nih.gov/health/menopause/what-menopause) |
| Average menopause age in India | [Indian Menopause Society survey 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5051232/) |
| Early menopause: family history, smoking, thyroid | [Office on Women's Health](https://womenshealth.gov/menopause/early-or-premature-menopause), [Cramer et al. 1995](https://pubmed.ncbi.nlm.nih.gov/7672145/), [Human Reproduction study](https://www.eurekalert.org/news-releases/629623), [American Journal of Epidemiology 2018](https://academic.oup.com/aje/article/187/4/696/4080179) |
| AMH does not predict natural fertility | [Steiner et al., JAMA 2017](https://doi.org/10.1001/jama.2017.14588) |
| Bone health | [NIAMS: Exercise for Your Bone Health](https://www.niams.nih.gov/health-topics/exercise-your-bone-health) |
| Breast cancer family history | [Cancer Research UK](https://www.cancerresearchuk.org/about-cancer/breast-cancer/risks-causes/family-history-and-inherited-genes) |
| Preeclampsia in mothers and daughters | [BMJ study, via ScienceDaily](https://www.sciencedaily.com/releases/2005/09/050918131619.htm) |

## Tests

Open `index.html?test` in a browser. The self-tests run in the page (no build step, no dependencies) against a separate storage key, so your real data is untouched. Results show at the bottom of the page and in `window.__TEST`.

Roots shows patterns, not diagnoses. It is a hackathon prototype, not a medical device.
