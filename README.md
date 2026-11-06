# Roots

**Know your roots. Your mother's health story is your health history.**

Roots is a tree-themed app that helps women understand the reproductive health they inherit. A mother tells her life and health story to a patient interviewer in her own language (Tamil, Hindi or English) and chooses what her daughter sees. The daughter's own cycle data, labs and family history then come together into insights and a plan.

Built for the Code with Claude: Women in AI Hackathon (women's health track).

## The problem

- Many women never talk to their mothers about menopause, periods or pregnancy. Both sides are too shy.
- That history matters: early menopause, breast cancer under 50, preeclampsia and PCOS in a mother are things doctors use to plan screening and care.
- It lives only in the mother's memory, and it's lost when she can no longer tell it.

## The app

| Tab | What it does |
|---|---|
| **Insights** | Your reproductive baseline (cycle length, variation, period length, heavy-flow days), trends against your own normal, patterns that link your data to your family's history, and habits toward an easier menopause. |
| **Root** (centre) | Gather your family's story: invite your mother to a voice-style interview in her language, scan old reports and discharge papers, and ask Claude questions about your roots. |
| **Family** | A visual family tree. You are the crown; your parents and grandparents are the roots. Tap anyone to see their conditions and story, and see health themes across generations. |

Privacy is built in: the mother approves every note before it reaches her daughter, and sensitive topics start out private.

## How Roots checks its data

Insights are only as good as the data behind them, so Roots guards against the usual ways cycle data misleads:

- **Enough data first.** Patterns need 6 baseline cycles and 3 recent ones. Until then, Roots says how many more it needs.
- **One odd cycle is not a pattern.** At least 2 of the last 3 usable cycles must fall outside her baseline range.
- **Missed logs.** A cycle of 45+ days (or 1.6× her normal) is more often a forgotten log than a real change, so Roots asks "Did you miss logging a period?" before using it.
- **Ask before flagging.** When cycles run long, Roots first asks whether anything changed (birth control, IUD, pregnancy, illness, travel, new medication) and only adds the pattern once she confirms.
- **Life events, with dates.** Cycles during hormonal birth control, a hormonal IUD, pregnancy or breastfeeding are set aside, and cycle patterns pause while these are ongoing. Illness and travel set aside that cycle. Medication or thyroid changes are kept but named as a possible reason. Life events stay on the device and are never shared with family.
- **Show the evidence.** A "What Roots is using" panel lists which cycles were used or set aside and why, how old the lab results are, and what her mother chose to share. Set-aside cycles appear hollow in the charts.
- **Uncertainty from the interview.** If her mother isn't sure of an age, the fact is marked approximate and Roots widens its estimates. Scanned lab reports keep their test date.
- **Claude sees the limits too.** The chat context includes the data-quality summary, so answers mention when data is limited or set aside.
- **Watching for the transition.** Because her mother's menopause came early, Roots plans to watch for the STRAW+10 early-transition sign (cycle length changing by 7+ days, more than once) from about age 40.

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

- Daughters of mothers with menopause at 45 or younger had faster declines in ovarian reserve markers — Human Reproduction, via [News-Medical](https://www.news-medical.net/news/20121113/Like-mothers-menopause-like-daughters-fertility-decline.aspx)
- Smoking and early natural menopause — [American Journal of Epidemiology](https://academic.oup.com/aje/article/187/4/696/4080179)
- Family history and breast cancer — [Cancer Research UK](https://www.cancerresearchuk.org/about-cancer/breast-cancer/risks-causes/family-history-and-inherited-genes)
- Daughters of women with preeclampsia — [BMJ study, via ScienceDaily](https://www.sciencedaily.com/releases/2005/09/050918131619.htm)

Roots shows patterns, not diagnoses. It is a hackathon prototype, not a medical device.
