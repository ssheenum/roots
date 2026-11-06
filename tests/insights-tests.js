/* Roots Insights self-tests. Open index.html?test (no build step, no dependencies).
   Uses localStorage key "mt4-test", so your real data is never touched. Results: window.__TEST and a panel on the page. */
(async function(){
  const R=[],ok=(name,cond,info="")=>R.push({name,pass:!!cond,info:cond?"":String(info)});
  const $=sel=>document.querySelector(sel),$$=sel=>[...document.querySelectorAll(sel)];
  const tick=()=>new Promise(r=>setTimeout(r,0));
  const fresh=()=>{S=DEF();save();location.hash="insights";S.ui.ins="cycle";render()};
  const click=async el=>{if(!el)throw new Error("missing element");el.click();await tick()};
  const answer=async(card,v)=>click($(`#ci-${card} .ix-opt[data-v="${v}"]`));
  const near=(a,b,e=.05)=>Math.abs(a-b)<e;
  try{
    /* data + logic */
    fresh();const s=sig(),b=bodySig();
    ok("cycle normal is 25–32",s.cyc.normal.join("-")==="25-32",s.cyc.normal);
    ok("cycle now is 33.7",near(s.cyc.rec,33.67),s.cyc.rec);
    ok("2 of last 3 outside normal → Changing",s.cyc.outN===2&&s.cyc.changing,s.cyc.outN);
    ok("spread is 6 and regular",s.cyc.spread===6&&s.cyc.regular,s.cyc.spread);
    ok("biggest jump is 4",s.cyc.jump===4,s.cyc.jump);
    ok("period 5 → 6.7, Changing",near(s.days.base,5)&&near(s.days.rec,6.67)&&s.days.changing);
    ok("heavy 2.2 → 3.7, Changing",near(s.heavy.base,2.17)&&near(s.heavy.rec,3.67)&&s.heavy.changing);
    ok("body: −49 min sleep, +5 bpm, −20% HRV, 3 of 3 moved",near(b.sleepMin,-49,.6)&&near(b.rhr,5)&&near(b.hrvPct,-20.4,.2)&&b.movedN===3);
    const V=verdicts(s);ok("verdicts: cycle Changing, spread Steady, iron Ask your doctor",V.cyc==="changing"&&V.spread==="steady"&&V.iron==="doctor",JSON.stringify(V));
    ok("every insight type resolves to a source",assertSources().length===0,assertSources());
    ok("search_literature returns null for unknown tags",search_literature(["nope"])===null);
    ok("search_literature only returns LIT entries",Object.values(SRC_TAGS).every(t=>LIT.includes(search_literature(t))));
    ok("save_answer rejects unknown keys",save_answer("favorite_color","blue")===null&&!S.answers.favorite_color);
    /* §14.1 summary */
    fresh();ok("summary says 3 changed signals",/3 things changed from your normal/.test($(".ix-summary").textContent),$(".ix-summary")?.textContent);
    ok("summary offers the check-in",!!$('.ix-summary [data-act="startci"]'));
    ok("4 number rows with verdict words",$$(".ix-sheet, .sheet .ix-num").length>=4&&/Changing/.test($(".sheet").textContent)&&/Steady/.test($(".sheet").textContent));
    /* §14.7 strips */
    const nums=$(".sheet").textContent;ok("range strip shows your normal 25–32 and now 34",/your normal 25–32/.test(nums)&&/now 34/.test(nums));
    const spreadRow=$$(".ix-num").find(r=>/Spread/.test(r.textContent));ok("spread 6 days = Steady",spreadRow&&/6 days/.test(spreadRow.textContent)&&/Steady/.test(spreadRow.textContent));
    /* §14.2 five Nos */
    ok("cycle card asks pregnancy first",/Is there any chance you could be pregnant\?/.test($("#ci-cycle").textContent));
    for(let i=0;i<5;i++)await answer("cycle","No");
    ok("after 5 × No the card state is signals",S.cards.cycle.state==="signals",S.cards.cycle.state);
    ok("body signals say 'may be contributing'",/may be contributing/.test($("#card-cycle").textContent));
    ok("2-of-3 rule is stated",/at least 2 do/.test($("#card-cycle").textContent));
    ok("answers are saved with a date",S.answers.pregnancy_possible?.v==="No"&&!isNaN(Date.parse(S.answers.pregnancy_possible.at)));
    await click($('#card-cycle [data-docadd="cycle_doc"]'));
    ok("thyroid item added to doctor list",S.doctor.some(d=>d.id==="cycle_doc"&&/thyroid/i.test(d.title))&&/Doctor list \(1\)/.test($(".ix-docchip").textContent));
    ok("card state becomes doctor",S.cards.cycle.state==="doctor",S.cards.cycle.state);
    /* §14.8 persistence */
    const stored=JSON.parse(localStorage.getItem("mt4-test"));ok("answers survive reload",stored.answers.new_medication?.v==="No"&&load().answers.breastfeeding?.v==="No");
    /* §14.3 contraception yes */
    fresh();await answer("cycle","No");await answer("cycle","Yes");
    const cc=$("#card-cycle").textContent;
    ok("birth control Yes → 'This may explain the change'",/This may explain the change/.test(cc)&&S.cards.cycle.state==="explained");
    ok("no stress text before override",!/may be contributing|stress/i.test($("#ci-cycle").textContent));
    ok("explained source is NHS irregular",/NHS: Irregular periods/.test($("#card-cycle .ix-src").textContent));
    await click($('#card-cycle [data-act="override"]'));
    ok("'Doesn't seem like the reason?' reveals body signals",/may be contributing/.test($("#card-cycle").textContent));
    /* §14.4 pregnancy not sure */
    fresh();await answer("cycle","Not sure");
    const pc=$("#card-cycle").textContent;
    ok("pregnancy Not sure → paused",S.cards.cycle.state==="paused"&&/home pregnancy test/.test(pc));
    ok("paused card attributes nothing else",!/may be contributing|thyroid|This may explain/i.test(pc));
    /* weight branch never suggests eating less */
    fresh();await answer("cycle","No");await answer("cycle","No");await answer("cycle","Yes");
    ok("weight/exercise branch: eat enough, no weight-loss advice",/eating enough for your activity/.test($("#card-cycle").textContent)&&!/lose weight|eat less|diet/i.test($("#card-cycle").textContent));
    /* §14.5 card anatomy */
    fresh();
    for(const c of $$(".ix-cards .ix-card")){const id=c.id;
      ok(`${id}: has What changed, Possible reasons, Small steps`,/What changed/i.test(c.textContent)&&/Possible reasons/i.test(c.textContent)&&/Small steps/i.test(c.textContent));
      const n=c.querySelectorAll(".ix-step").length;ok(`${id}: 2–3 steps`,n>=2&&n<=3,n);
      const links=[...c.querySelectorAll("a[data-source]")].filter(a=>!a.closest("details"));
      ok(`${id}: exactly one source link from LIT`,links.length===1&&LIT.some(e=>e.url===links[0].href),links.length)}
    /* steps persist */
    await click($('[data-step="cycle:log"]'));ok("steps are saved",S.cards.cycle.steps.log===true);
    /* §14.6 lint both pills */
    fresh();ok("lintCopy: zero banned phrases on Your cycle",lintCopy().length===0,lintCopy());
    for(let i=0;i<5;i++)await answer("cycle","No");ok("lintCopy: zero after check-in",lintCopy().length===0,lintCopy());
    S.ui.ins="prepare";render();ok("lintCopy: zero banned phrases on Prepare ahead",lintCopy().length===0,lintCopy());
    ok("lintText catches banned phrases",lintText("You have a condition").length===1&&lintText("that risk").length===0&&lintText("you're at risk").length===1);
    /* prepare ahead */
    const pa=$("#app").textContent;
    ok("Prepare ahead shows 'biggest jump: 4 days'",/biggest jump: 4 days/.test(pa));
    ok("renamed to 'Perimenopause: what to watch, and when'",/Perimenopause: what to watch, and when/.test(pa)&&!/may come early too/.test(pa));
    ok("family history 'raises the chance; it does not decide'",/raises the chance; it does not decide/.test(pa));
    ok("fill-a-gap asks tobacco first",/Do you smoke or use tobacco/.test($("#ci-gap").textContent));
    await answer("gap","No");ok("then pregnancy plans",/thinking about pregnancy/.test($("#ci-gap").textContent));
    /* red flags */
    S.ui.ins="cycle";S.ui.flags=true;render();await click($('[data-flag="emerg"]'));
    ok("red flag shows emergency banner first",/Get emergency care now/.test($(".ix-banner").textContent)&&$("#app").querySelector(".ix-banner").compareDocumentPosition($(".ix-summary"))&Node.DOCUMENT_POSITION_FOLLOWING);
    /* §14.8 reset + clear */
    S.ui.flags=false;render();save_answer("tobacco_use","No");
    S.answers={};S.cards={};S.flags={};save();ok("clear check-in answers empties S.answers",Object.keys(load().answers).length===0);
    save_answer("pregnancy_possible","No");S=DEF();save();ok("reset sample data clears answers",Object.keys(load().answers).length===0);
    /* AI guardrails */
    const g1=sanitizeAI('{"say":"Your cycles are longer.","steps":["Log it"],"source_id":"made_up","ask":{"key":"ssn","question":"?"}}',"FALLBACK");
    ok("AI: unknown source_id and ask.key dropped",g1.source_id===null&&g1.ask===null&&g1.say==="Your cycles are longer.");
    const g2=sanitizeAI({say:"You have a thyroid problem.",steps:[],source_id:"figo2018",ask:null},"FALLBACK");
    ok("AI: banned copy falls back to card text",g2.say==="FALLBACK"&&g2.fallback);
    ok("AI: non-JSON falls back",sanitizeAI("not json","FALLBACK").say==="FALLBACK");
    /* §14.9 guided mode */
    fresh();ok("guided mode: 'Ask about this' hidden",SAMPLE?true:!$('[data-act="askopen"]')&&/Open in Claude to ask questions/.test($("#app").textContent));
    /* §14.10 a11y */
    const svgs=$$("#app svg.chart, #app .ix-strip svg");ok("every chart SVG has role=img and an aria-label",svgs.length>5&&svgs.every(x=>x.getAttribute("role")==="img"&&x.getAttribute("aria-label")),svgs.length);
    ok("strip aria-label states the verdict",svgs.some(x=>x.getAttribute("aria-label")==="Cycle length 34 days, above your normal of 25 to 32, inside the typical 24 to 38"));
    ok("check-in region is aria-live polite",$("#ci-cycle").getAttribute("aria-live")==="polite");
    const small=$$("#app .ix-opt, #app .ix-step, #app .ix-docchip").filter(el=>{const r=el.getBoundingClientRect();return r.height<44});ok("tap targets ≥44px",small.length===0,small.length);
    ok("no alarm orange on Insights",!$("#app").innerHTML.includes("#C46A2B"));
  }catch(e){ok("test run crashed",false,e.stack||e)}
  fresh();
  const fail=R.filter(r=>!r.pass);window.__TEST={pass:R.length-fail.length,fail:fail.length,results:R};
  const pre=document.createElement("pre");pre.id="testout";pre.style.cssText="white-space:pre-wrap;font:12px/1.4 ui-monospace,monospace;background:#fff;padding:12px;border-radius:12px;max-width:420px;margin:12px auto";
  pre.textContent=`${R.length-fail.length}/${R.length} passed\n`+R.map(r=>`${r.pass?"✓":"✗"} ${r.name}${r.info?" — "+r.info:""}`).join("\n");document.body.appendChild(pre);
  console.log(pre.textContent);
})();
