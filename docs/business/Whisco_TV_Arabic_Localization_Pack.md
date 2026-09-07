# WHISCO TV — Arabic localization pack
**Operator copy deck · v1.0 · 7 September 2026**  
whisco.tv · Bahrain · MSA with a Gulf living-room register

Companions: `Whisco_TV_Company_Dossier.md`, `Whisco_TV_Ramadan_2027_Campaign_Bible.md`, `Whisco_TV_Marketing_Playbook.md` §3 (store fields).

This pack is shippable copy, not a translation memory dump. Every public string is **Modern Standard Arabic** written the way a Bahrain / Dubai / Riyadh product would speak on screen: short, direct, not Egyptian street (`مش` / `عايز` / `دلوقتي`), not news-anchor classical (`إنّما` / `إذْ`). Gulf spoken flavour is allowed only in WhatsApp drafts already published in the Ramadan bible — not in chrome.

**How to read a row**

| EN (source of truth) | AR (ship this) | Flag |
|---|---|---|
| English UI / marketing string | Preferred Arabic | `·` clean · `?` debatable (see §5) · `!` do not ship the rejected option |

Character counts in store sections are **Unicode code points**, which is what Play / App Store Connect count.

---

## 0. Register rules (read once)

1. **You-form.** Chrome and buttons use singular أنت implied, not أنتم. `شاهد الآن` not `شاهدوا الآن`. Footer legal lines may use the impersonal.
2. **No dialect in chrome.** No Egyptian, no Gulf spoken particles (`شحالك`, `أبي`, `هالحين`) on buttons or nav.
3. **No stiff verbal nouns where a verb works.** `أضف إلى قائمتي` beats `إضافة إلى قائمة المشاهدة`.
4. **Digits stay Western (1 2 3)** in UI. Gulf apps do this. Arabic-Indic (١ ٢ ٣) only if a user setting appears later.
5. **Brand in Arabic lock-up:** `وسکو تي في`. Latin `Whisco TV` stays on the logo mark and in mixed sentences when we name the product as a proper noun next to a Turkish title.
6. **Shahid the competitor** is `شاهد`. Our verb “watch” is also `شاهد`. In titles and ASO we never lead with the bare word `شاهد` as if we were MBC. Use `مشاهدة` or `وسکو` first.
7. **Player** = `المشغّل`. Not `البلاير`. Not `المشغِّل` without shadda if we can help it; include the shadda in source, browsers will render it.
8. **Legal / pirate.** `قانوني` / `غير قانوني`. Never `قرصنة مجانية` as a feature. Anti-pirate line: `ليست علبة`.
9. **Do not invent catalog numbers.** Print 581 / 15,696 / 333 / 61 only after the January recount if a poster ships in 2027.

---

## 1. Site chrome

### 1.1 Primary navigation

| EN | AR | Flag |
|---|---|---|
| Home | الرئيسية | · |
| Live TV | بث مباشر | ? `التلفزيون المباشر` is clearer for first-time users, longer. Ship `بث مباشر`. |
| On Demand | عند الطلب | ? `حسب الطلب` is the broadcast-textbook calque. OTT Gulf sites (Shahid, OSN, StarzPlay AR) use `عند الطلب`. |
| New | الجديد | · |
| My List | قائمتي | ? Netflix AR is `قائمتي`. `قائمة المشاهدة` is more explicit, eats nav width. |
| Guides | الأدلة | ? `دليل المشاهدة` (singular) if the page is one index. Keep plural to match EN IA. |
| Languages | اللغات | · |
| Arabic | العربية | · |
| Turkish | التركية | · |
| Hindi | الهندية | · |
| Urdu | الأردية | · |
| Malayalam | المالايالامية | ? Some Gulf users type `الماليالامية` (one ي). Ship the doubled-yā form; add the short form as a search synonym. |
| Tamil | التاميلية | · |
| Telugu | التيلوغوية | · |
| Bengali | البنغالية | · |
| Filipino | الفلبينية | · |
| Indonesian | الإندونيسية | · |
| Nepali | النيبالية | · |
| Sinhala | السينهالية | · |
| English | الإنجليزية | · |
| Search | بحث | · |
| About | عن وسکو | ? Not `من نحن` — we are a room, not a corporation on this page. |
| Legal | القانونية | · |
| Patrons | الداعمون | ? Patronage program uses `دعم` / `راعٍ`. Public page title: `الداعمون`. Mark on a credit: `دعم`. |
| Ramadan | رمضان | · |
| Evenings on Whisco | أمسيات وسکو | · (locked in the Ramadan bible) |

### 1.2 Buttons and actions

| EN | AR | Flag |
|---|---|---|
| Watch now | شاهد الآن | · |
| Play | تشغيل | · |
| Resume | متابعة المشاهدة | · |
| Pause | إيقاف مؤقت | · |
| Add to My List | أضف إلى قائمتي | · |
| Added to My List | في قائمتك | · |
| Remove from My List | إزالة من قائمتي | · |
| Share | مشاركة | · |
| Copy message | انسخ الرسالة | · |
| Copied | تم النسخ | · |
| Open WhatsApp | افتح واتساب | · |
| See all | عرض الكل | · |
| Back | رجوع | · |
| Close | إغلاق | · |
| Filter | تصفية | · |
| Live | مباشر | · |
| Series | مسلسل | · |
| Movie | فيلم | · |
| Episode | حلقة | · |
| Season | موسم | · |
| Episodes | حلقات | · |
| Trailer | إعلان | ? `إعلان تشويقي` is accurate and stiff. Use `إعلان` only if it cannot be confused with our display ad. Safer: `مقطع`. |
| More info | المزيد | · |
| Report a problem | بلّغ عن مشكلة | · |
| Try another title | جرّب عنواناً آخر | · |
| Watch on Shahid | شاهِد على «شاهد» | ! The circumflex and quotes are load-bearing. Without them this reads as a command to use us. |
| Install app | ثبّت التطبيق | · |
| Continue on the web | تابع على الموقع | · |

### 1.3 Player and catalog states

| EN | AR | Flag |
|---|---|---|
| Loading… | جارٍ التحميل… | · |
| Buffering… | جارٍ التجهيز… | ? `التخزين المؤقت` is the textbook term and looks like an error. |
| Playing | قيد التشغيل | · |
| Paused | متوقف | · |
| Unavailable | غير متاح الآن | · |
| This title is not available | هذا العنوان غير متاح حالياً | · |
| Geo-restricted | غير متاح في بلدك | ? Do not ship `محظور جغرافياً` — sounds like a ban. The honest line is availability, not punishment. |
| Not available in your country | المحتوى غير متاح في دولتك | ? `بلدك` is warmer; `دولتك` is precise for GCC geo. Prefer `بلدك` in chrome, `في إحدى دول الخليج` in longer copy. |
| This channel is offline | هذه القناة متوقفة حالياً | · |
| We’ll hide it until it’s healthy | سنخفيها حتى تعود سليمة | · |
| Official source | مصدر رسمي | · |
| Free-to-air | بث أرضي مجاني | ? Long. Short label: `مجاني مفتوح`. Tooltip gets the long form. |
| Public domain | ملك عام | · |
| Embed from the rights holder | عرض من صاحب الحق | · |
| Subtitles | الترجمة | · |
| Arabic subtitles | ترجمة عربية | · |
| Arabic dub | دبلجة عربية | · |
| Original audio | الصوت الأصلي | · |
| English captions | ترجمة إنجليزية | · |
| No captions on this file | لا توجد ترجمة على هذا الملف | · |
| One ad on this page. Never on the player. | إعلان واحد في الصفحة. ليس على المشغّل. | · |
| Sign in | — | ! We do not have accounts. Do not invent the string. |
| Subscribe | — | ! Never. If a system library injects it, override to empty. |

### 1.4 Search, empty, errors

| EN | AR | Flag |
|---|---|---|
| Search titles, channels, languages | ابحث عن عنوان أو قناة أو لغة | · |
| Search Hindi films, Turkish series, live TV… | ابحث: أفلام هندية، مسلسلات تركية، بث مباشر… | · |
| No results | لا نتائج | · |
| Nothing matches that search | لا يوجد ما يطابق هذا البحث | · |
| Try a title, a language, or a channel name | جرّب اسماً أو لغة أو قناة | · |
| Your list is empty | قائمتك فارغة | · |
| Add something from On Demand. It stays on this device. | أضف عنواناً من «عند الطلب». القائمة تبقى على هذا الجهاز. | · |
| Something broke on our side | حدث خلل من جهتنا | · |
| Refresh the page | حدّث الصفحة | · |
| Page not found | الصفحة غير موجودة | · |
| You are outside the six GCC countries we clear for | أنت خارج دول الخليج الست التي نتحقق من توفر المحتوى فيها | · |
| We are not a VPN service | نحن لسنا خدمة VPN | · keep Latin `VPN` — the Arabic `شبكة خاصة افتراضية` helps no one. |

### 1.5 Footer, legal, patronage chrome

| EN | AR | Flag |
|---|---|---|
| Free legal TV for Gulf households | تلفزيون قانوني مجاني لبيوت الخليج | · |
| Built in Bahrain | صُنع في البحرين | ? `مبني في البحرين` is closer to the English verb. `صُنع` is shorter on a footer. |
| No signup. No subscription. | بلا تسجيل. بلا اشتراك. | · |
| One ad per page. Never on the player. | إعلان واحد في الصفحة. ليس على المشغّل. | · |
| Privacy | الخصوصية | · |
| Terms | الشروط | · |
| Sourcing | مصادر المحتوى | · |
| Takedown | طلبات الإزالة | · |
| Contact | تواصل معنا | · |
| legal@whisco.tv | legal@whisco.tv | · do not localise the address |
| This [hub / drop / note] is made possible by… | يُقدَّم هذا الركن بدعم من… | · locked in patronage program |
| Evening viewing this Ramadan is made possible by… | تُقدَّم مشاهدة أمسيات هذا رمضان بدعم من… | · |
| Patron | دعم | ? Regulator-facing alt: `راعٍ`. Default public mark: `دعم`. |
| Whisco TV remains free. [Patron] did not choose the titles and does not see your viewing. We do not place their mark on the player. | وسکو تي في يبقى مجاناً. لم يختر [الراعٍ] العناوين ولا يرى مشاهداتك. لا نضع علامته على المشغّل. | · |
| Data Not Collected | لا تُجمع بيانات | · matches store privacy label |
| © Whisco TV. All rights reserved. | © وسکو تي في. جميع الحقوق محفوظة. | · |

### 1.6 Language-hub chrome lines

| EN | AR |
|---|---|
| Hindi tonight — made possible by [Name] | سهرة هندية بدعم من [الاسم] |
| This Arabic shelf is made possible by [Name]. | يُقدَّم ركن العربية بدعم من [الاسم]. |
| This week’s new titles are made possible by [Name]. | تُقدَّم عناوين هذا الأسبوع بدعم من [الاسم]. |
| Quiet hour | الركن الهادئ |
| Arabic evenings | أمسيات عربية |
| Finished dizi | دزي مكتمل |
| After tarawih — Urdu | بعد التراويح — أردية |
| Teleserye after shift | بعد الوردية — فلبينية |
| Eid binge | سهرات العيد |

### 1.7 Share sheet (WhatsApp / copy)

Default caption, Arabic-first. Keep the URL on its own line.

**EN source**
> Free legal TV for Gulf households. No signup. One ad, never on the player.
> whisco.tv

**AR ship**
> تلفزيون قانوني مجاني لبيوت الخليج. بلا تسجيل. إعلان واحد، ليس على المشغّل.
> whisco.tv

**Title share**
> EN: Watching on Whisco TV — legal, free.
> AR: أشاهد على وسکو تي في — قانوني ومجاني.
> {url}

Do not auto-append hashtags.

---

## 2. About page + store listings

### 2.1 About page — `whisco.tv/about`

Ship as a bilingual page, AR first when `dir=rtl`.

#### EN (source)

Whisco TV is a free, legal television room for households in the six GCC states. It is not a subscription. It is not a pirate box. It is not Shahid.

The name is the founder’s Shih Tzu. The product is the same personality: loyal, fast, no pretence.

What you can open tonight, as of 5 September 2026:

- 581 live channels (free-to-air and official sources), health-checked every six hours. Dead streams hide themselves.
- 15,696 on-demand titles in 13 languages, including 333 Arabic series (~7,100 episodes), 61 Turkish series (~3,650 episodes), 1,163 Pakistani dramas, 2,500+ official Hindi films, plus Malayalam, Tamil, Telugu, Bengali, Filipino and Indonesian shelves.
- No account. Watchlist and resume live on this device.
- One display ad on the page. Never on the player. No pop-unders.

Every title is sourced from official broadcaster channels and embeds, free-to-air broadcasts, public domain, or a written licence. Before it appears it is checked for embeddability, duration, and availability in Bahrain, Saudi Arabia, the UAE, Kuwait, Qatar and Oman. Titles that fail a country check are hidden, not shown broken. Takedown notices: legal@whisco.tv.

Most on-demand plays are official YouTube embeds. The network keeps its in-player advertising. We keep the page around it honest.

We do not carry live premium sport. Pay TOD or beIN if that is the evening. We do not carry this year’s Shahid original. Watch that on Shahid. We do not unlock a pay wall with a VPN.

Whisco is built in Bahrain by Ali Albaharna. The intended contracting entity is Whisco Media W.L.L., under formation. The site went live on 20 August 2026. Apps are coming through store review. We do not publish audience numbers we have not earned.

#### AR (ship)

وسکو تي في غرفة تلفزيون قانونية ومجانية لبيوت دول الخليج الست. ليست اشتراكاً. ليست علبة. ليست «شاهد».

الاسم لكلب المؤسس من سلالة الشيه تزو. المنتج على مزاجه: وفيّ، سريع، بلا ادّعاء.

ما يمكن فتحه الليلة، بحسب جرد 5 سبتمبر 2026:

- 581 قناة حيّة (بث مفتوح ومصادر رسمية)، تُفحص كل ست ساعات. القناة التي تموت تُخفى وحدها.
- 15,696 عنواناً عند الطلب بثلاث عشرة لغة، منها 333 مسلسلاً عربياً (نحو 7,100 حلقة)، و61 مسلسلاً تركياً (نحو 3,650 حلقة)، و1,163 دراما باكستانية، وأكثر من 2,500 فيلم هندي رسمي، إلى جانب رفوف المالايالامية والتاميلية والتيلوغوية والبنغالية والفلبينية والإندونيسية.
- بلا حساب. قائمة المشاهدة ومتابعة الحلقة تبقى على هذا الجهاز.
- إعلان واحد في الصفحة. ليس على المشغّل. بلا نوافذ منبثقة.

كل عنوان يأتي من قنوات رسمية أو تضمين رسمي أو بث مفتوح أو ملك عام أو رخصة مكتوبة. قبل ظهوره يُفحص التضمين والمدة والتوفر في البحرين والسعودية والإمارات والكويت وقطر وعُمان. ما يفشل فحص الدولة يُخفى، ولا يُعرض مكسوراً. طلبات الإزالة: legal@whisco.tv.

معظم المشاهدة عند الطلب تتم عبر مشغّل يوتيوب الرسمي. الشبكة تحتفظ بإعلانها داخل الفيديو. نحن نُبقي الصفحة من حولها صادقة.

لا نحمل الرياضة المدفوعة المباشرة. ادفع TOD أو beIN إن كان المساء مباراة. لا نحمل عمل «شاهد» الجديد لهذا العام؛ يُشاهد هناك. لا نفتح جداراً مدفوعاً عبر VPN.

وسکو مبني في البحرين على يد علي البحرانة. الجهة المتعاقدة المقصودة: وسکو ميديا ذ.م.م. (قيد التأسيس). الموقع يعمل منذ 20 أغسطس 2026. التطبيقات في مراجعة المتاجر. لا ننشر أرقام جمهور لم نكسبها.

**Flag:** `شيه تزو` vs `شي تزو` vs leave `Shih Tzu` in Latin. Ship `شيه تزو` once, then the dog is just `وسکو`.  
**Flag:** Founder name `علي البحرانة` is the natural Arabic of Albaharna. Confirm with Ali before the About page goes AR-first. Fallback: `علي البحارنة`.

### 2.2 Arabic ASO — what people actually type

We do not have Search Console volume for Arabic queries yet. What follows is **query-shape research** from live Play titles, YouTube channel names, and Arabic listicles about Turkish drama in 2025–26 — not invented monthly counts. Re-check with Play Console / App Store Connect search suggestions the week the listing goes public.

**Head shapes (high intent, crowded with grey APKs)**

| Query shape | Why it matters | Our use |
|---|---|---|
| مسلسلات تركية مترجمة | Dominant discovery string. Grey apps squat on it. | Body + keyword field. Never the app *name* (looks like those APKs). |
| مسلسلات تركية مدبلجة | Same audience, dub path. Shahid/Weyyak own the paid/legal end. | Body. Honesty: we label dub vs sub per title. |
| مسلسلات تركية مدبلجة للعربية | Longer, more legal-leaning than the two-word form. | Description sentence. |
| تلفزيون مجاني | Broad. Mixed with IPTV spam. | Short description, not title lead. |
| بث مباشر / تلفزيون مباشر | Live intent. | Subtitle / short. |
| قنوات عربية مباشرة | Live Arabic FTA. | Long description. |
| مسلسلات عربية مجانية | Egyptian/Levantine + Khaleeji sofas. | Long description. |
| أفلام هندية / مسلسلات هندية | Shared-flat second language. | Long description. |
| بدون اشتراك / بدون تسجيل | Complaint language. Matches our product. | Short + bullets. |
| تلفزيون قانوني / بديل للعلبة | Rare in stores, high brand fit. | About + long description, not keywords (low typed volume). |

**Do not stuff:** `IPTV`, `ياسين`, `أكوام`, `قصة عشق`, `beIN`, `حصري`.  
**Do not lead a title with** `شاهد` (competitor collision).

### 2.3 Google Play — Arabic listing

Play title ≤ 30. Short description ≤ 80. Long description: sentences, not comma soup.

#### Title candidates (count in parentheses)

| Variant | AR | Chars | Note |
|---|---|---|---|
| A (default) | وسکو تي في: بث مجاني | 19 | Brand + head term |
| B | وسکو: تلفزيون قانوني | 20 | Differentiator vs IPTV spam |
| C | وسکو تي في: تركي مجاني | 21 | Only if A/B stall. Risks looking like a dizi APK. |

EN source titles for reference: `Whisco TV: Free Live TV` / `Whisco TV: Free Expat TV`.

#### Short description candidates (≤80)

| # | AR | Chars |
|---|---|---|
| 1 | تلفزيون قانوني مجاني للخليج. عربي، تركي، هندي. بلا اشتراك. | 58 |
| 2 | بث مباشر ومسلسلات بـ13 لغة. بلا تسجيل. إعلان واحد. | 51 |
| 3 | تلفزيون مجاني قانوني في الإمارات والسعودية والبحرين. | 52 |

EN sources: `Free legal live TV & movies for Gulf expats. Hindi, Malayalam, Arabic, Turkish.`

#### Long description (AR ship)

وسکو تي في تلفزيون قانوني مجاني لبيوت الخليج. بلا تسجيل. بلا اشتراك. بلا علبة.

افتح بثاً مباشراً وقنوات عربية مفتوحة، ومسلسلات عربية، ومسلسلات تركية مترجمة أو مدبلجة حين يتوفر الملف الرسمي، وأفلاماً هندية ودراما أردية ورفوفاً فلبينية وإندونيسية ومالايالامية. ثلاث عشرة لغة في غرفة واحدة.

المحتوى من مصادر رسمية وبث مفتوح وملك عام. نفحص كل عنوان على دول الخليج الست قبل أن يظهر. ما لا يُتاح في بلدك يُخفى، ولا يُعرض مكسوراً.

إعلان واحد في الصفحة. ليس على المشغّل. لا نوافذ منبثقة. قائمة المشاهدة تبقى على جهازك.

لا نحمل الرياضة المدفوعة، ولا عمل «شاهد» الجديد لهذا العام. تلك المنصات موجودة؛ نحن الغرفة القانونية حولها.

صُنع في البحرين.

**Play long EN (keep in the English storefront; do not delete when adding AR):**  
Free legal live TV and movies for GCC expats — Hindi, Malayalam, Tamil, Arabic, Turkish and more. No subscription.

#### Play bullets (AR overlay on screenshots)

1. تلفزيون قانوني مجاني لبيوت الخليج.
2. ثلاث عشرة لغة. بلا تسجيل.
3. مصادر رسمية وبث مفتوح. ليست علبة.
4. مسلسلات عربية وتركية وهندية على رف واحد.
5. إعلان واحد. ليس على الفيديو. بلا اشتراك.
6. يعمل في الشقة. بلا طبق.

### 2.4 App Store — Arabic localization

Name ≤ 30. Subtitle ≤ 30. Keyword field ≤ 100, comma-separated, **no spaces after commas**, no word already in name or subtitle.

| Field | AR | Chars |
|---|---|---|
| Name | وسکو تي في | 10 |
| Subtitle A | بث مباشر وأفلام مجاناً | 21 |
| Subtitle B | تلفزيون مغتربين قانوني | 21 |
| Subtitle C | عربي تركي هندي مباشر | 20 |

**Keyword field (Arabic localization) — 98 characters**

```
مجاني,قنوات,مسلسلات,مترجمة,مدبلجة,افلام,هندية,اردية,فلبينية,خليج,بحرين,امارات,سعودية,بدون,تسجيل
```

Count: مجاني(5)+قنوات(5)+مسلسلات(7)+مترجمة(6)+مدبلجة(6)+افلام(5)+هندية(5)+اردية(5)+فلبينية(7)+خليج(4)+بحرين(5)+امارات(6)+سعودية(6)+بدون(4)+تسجيل(5) + 14 commas = 95. Headroom for `عمان` or `قطر` if a country storefront needs it; drop `فلبينية` first.

Do **not** repeat `وسکو` / `تي` / `في` / `بث` / `مباشر` / `أفلام` / `مجاناً` if those words sit in name + subtitle A.

**App Store promotional text** (170-character class, update without a new binary):

> غرفة قانونية في الشقة. مسلسلات عربية وتركية مترجمة أو مدبلجة حين يكون الملف رسميًا، وبث مباشر، بلا تسجيل وبلا اشتراك. إعلان واحد، ليس على المشغّل.

**App Store description (AR)** — reuse the Play long description. Apple ranks the keyword field, not this prose.

**Privacy nutrition label (AR copy next to “Data Not Collected”)**  
لا يجمع التطبيق بيانات في الإصدار 1. قائمة المشاهدة تبقى على الجهاز. لا نضع أدوات قياس داخل التطبيق قبل الإصدار 1.1.

---

## 3. Two original Arabic guides

These are **written in Arabic**, not back-translated from the English SEO pack. English below each guide is a synopsis for the operator, not a second original.

Suggested URLs (verify against the sitemap):  
`https://whisco.tv/guides/turkish-arabic-legal`  
`https://whisco.tv/guides/free-legal-tv-arab-expats-gcc`

Update catalog counts in the last week before publish.

---

### 3.1 Guide A — المسلسلات التركية المدبلجة والمترجمة: الدليل الكامل للمشاهدة القانونية المجانية

**H1:** المسلسلات التركية المدبلجة والمترجمة — أين تُشاهد قانونياً ومجاناً من الخليج

البحث عن «مسلسلات تركية مترجمة» يفتح في العادة تطبيقاً رماديًا، أو موقعاً اسمه يشبه قصة حب، أو قناة يوتيوب غير موثّقة تضع علامة الترجمة فوق ملف لا تملكه. الجمهور العربي لم يختَر هذا الطريق عن رغبة في المخاطرة. اختاره لأن الرف القانوني مبعثر: الدبلجة على منصة، والترجمة على ثانية، والحلقات الكاملة على قناة رسمية تركية لا تظهر في نتائج العربية.

هذا الدليل لا يبيع مكتبة لا نملكها. يفرّق بين ثلاثة أشياء يخلطها البحث: **الدبلجة العربية**، **الترجمة العربية على الصورة**، و**الملف الرسمي الذي يُسمح بتشغيله من عنوان خليجي**.

#### الدبلجة غير الترجمة

الدبلجة العربية عمل مرخّص، صوت الممثل العربي يحل محل التركي. حقوقه تجلس غالباً عند منصات عربية مدفوعة أو عند قناة رسمية تركية أنشأت قناة عربية على يوتيوب. الترجمة العربية أخف كلفة، وقد تأتي من الشبكة نفسها أو من منصة اشترت المسار. الاثنان قانونيان حين يملكهما صاحب الحق. الاثنان غير قانونيين حين يضعهما حساب يكتب «مترجم» على فيديو مُنزّل.

إذا فتحت حلقة ووجدت ترجمة آلية تركّب جملة الزواج على قائمة خضار، فأنت لست على ملف الشبكة. أنت على طبقة فوق ملف شخص آخر.

#### أين يجلس الرف القانوني اليوم

الخريطة تتغيّر. أعد فحص العنوان قبل أن توصي ابن عمك.

- **شاهد.** المسار العربي الأول للأعمال المعروضة للجمهور العربي هذا الموسم، دبلجة أو ترجمة حسب العقد. العمل الجديد لهذا العام يُشاهد هناك. ليس عندنا. قول خلاف ذلك كذب.
- **وياك وغيرها من المنصات العربية.** مكتبات تركية وعربية وآسيوية. بعضها مجاني بإعلان، بعضها خلف اشتراك. اقرأ شاشة السعر قبل أن تضغط.
- **نتفلكس / أو إس إن+.** بيت كثير من النسخ الإنجليزية عالية الدقة، وأحياناً التركية الأصلية. ليست مجاناً. إن كان ما تريده هو المسار الإنجليزي لنسخة حصرية، ادفع هناك.
- **القنوات التركية الرسمية على يوتيوب.** ATV وStar وKanal D وShow وNOW وTRT ترفع حلقات كاملة حين تختار هي ذلك. الجودة غالباً جيدة لأن الشبكة هي من ترميز الملف. الترجمة الإنجليزية حظ. الترجمة العربية توجد على قنوات عربية رسمية تابعة لبعض الشبكات — وليست على كل عنوان.
- **تابعي (tabii) ومنصات تركيا الرقمية.** مسار مجاني أو مختلط، التوفر في الخليج يتبدّل. لا تَعِد به من البحرين قبل أن تفتحه من شبكة خليجية.
- **وسکو تي في.** نُفهرس ما يمرّ على فحص التضمين والمدة والتوفر في الدول الست. حتى أوائل سبتمبر 2026: 61 مسلسلاً تركياً، نحو 3,650 حلقة، منها أعمال مكتملة مثل *Emanet* (أكثر من 800 حلقة) و*Teşkilat* (183 حلقة)، وموجة 2025–26 مثل *Aynadaki Yabancı* و*Çarpıntı* و*Ben Leman* و*Cennetin Çocukları* حيث ما زال العنوان يمرّ على عنوان خليجي. معظم التشغيل عندنا عبر مشغّل يوتيوب الرسمي: الشبكة تأخذ إعلانها داخل الفيديو، ونحن نبقي إعلاناً واحداً في الصفحة، بعيداً عن المشغّل.

ما يختفي من يوتيوب بعد بيع الحق لمنصة مدفوعة يختفي عندنا أيضاً. هذا ليس عطلاً. هذا العقد.

#### ما لن تجده هنا، ولماذا نقوله في السطر الأول

لن تجد حلقة الأمس من عمل حصري على شاهد، بجودة الاستوديو ودبلجة اليوم نفسه. لن تجد ملفاً إنجليزياً استوديو لكل عنوان. لن تجد «كل الدزي في العالم» — تلك الجملة هي جملة العلبة.

إن كان العنوان على نتفلكس فقط هذا الشهر، نكتب ذلك. إن كانت القائمة الرسمية على يوتيوب ناقصة، نكتب أنها ناقصة. صفحة القرصنة أطول دائماً. وهي أيضاً الصفحة التي تموت في الحلقة السابعة عشرة.

#### كيف تختار بين مدبلج ومترجم

- البيت يتكلم العربية بطلاقة ولا يريد قراءة الشاشة بعد يوم عمل: ابحث عن الدبلجة المرخّصة أولاً، على شاهد أو على قناة الشبكة العربية الرسمية.
- البيت مختلط — عربي وتركي وإنجليزي في الغرفة نفسها: الترجمة على الملف الأصلي أصدق من دبلجة تُخفي نبرة الممثل.
- تتعلم التركية: الصوت الأصلي + ترجمة، لا الدبلجة.

وسکو يضع على البطاقة اللغة التي يملكها الملف، لا اللغة التي يتمناها البحث.

#### الجهاز، بسرعة

الهاتف والحاسوب: المتصفح إلى الرف التركي، أو التطبيق حين يخرج من المراجعة. التلفزيون الذكي: تطبيقات شاهد ونتفلكس ويوتيوب من متجر الجهاز نفسه. عصا فاير: متجر أمازون الرسمي، ليست قائمة يرسلها رقم واتساب. بثّ تبويب قانوني إلى الشاشة أقل أناقة من تطبيق أصلي، وأطيب من ملف 360p.

#### جملة واحدة

مجاني وقانوني ومترجم أو مدبلج: ممكن، ليس شاملاً. يوتيوب الرسمي هو العمود الفقري المجاني. نتفلكس هو عمود الإنجليزية المدفوعة. شاهد هو عمود العربية المدفوعة والمجانية حسب العقد. وسکو هو الفهرس الذي يرفض المسار الرابع.

الرف التركي: [whisco.tv/turkish](https://whisco.tv/turkish)

**EN synopsis.** Distinguishes Arabic dub vs Arabic sub vs official file playable on a GCC IP. Maps Shahid, Weyyak, Netflix/OSN+, official TR network YouTube, tabii, and Whisco’s 61-series shelf. Names only catalog titles we already claim. Refuses same-day Shahid exclusives and “every dizi” language. Devices: official stores only.

---

### 3.2 Guide B — التلفزيون القانوني المجاني لبيوت المغتربين العرب في الخليج

**H1:** تلفزيون قانوني مجاني في شقة الخليج — دليل البيوت المصرية والشامية

الشقة في دبي أو الرياض أو المنامة بيت مختلط أكثر مما كانت عليه القاهرة أو دمشق. الغرفة نفسها قد تطلب مسلسلاً مصرياً بعد المغرب، وعملاً سورياً قديماً يوم الجمعة، ودزيًا مدبلجاً بعد التراويح، وقناة أطفال قبل الأذان. الحل الذي يصل عبر واتساب هو في الغالب علبة: «كل القنوات»، سعر بالدينار، رقم يختفي بعد العيد.

العلبة ليست تلفازاً. هي قائمة. والقائمة تتجمّد.

هذا الدليل مكتوب للبيت العربي المغترب في الدول الست — مصري، شامي، سوداني، عراقي، يمني، مغاربي — لا للجمهور داخل مصر أو بلاد الشام. الحقوق تختلف. ما يُفتح في القاهرة قد يُغلق في جدة.

#### ما يريده البيت، وما لا نعد به

يريد البيت: مسلسلات عربية يفهمها بلا ترجمة، بثاً مباشراً لمحطات يعرف شعارها، وألا يُفاجأ باشتراك في منتصف الحلقة، وألا يُطلب منه حساب كي يضغط تشغيل.

لا نعد بعمل شاهد الجديد لهذا العام. لا نعد بدوري واضح أو بدوري إنجليزي. لا نعد بجودة الاستوديو على كل ملف، لأن كثيراً مما هو قانوني مجاناً يصل عبر القناة الرسمية على يوتيوب.

حتى أوائل سبتمبر 2026 يضم رفّ العربية عندنا 333 مسلسلاً، نحو 7,100 حلقة، موزّعة هكذا: الكويت 121، سوريا 73، لبنان 52، الإمارات 42، الأردن 26، قطر 15، البحرين 1. الرقم البحريني صغير ونعلنه صغيراً. الوطن الذي بُني فيه المنتج لا يحتاج مبالغة.

إلى جانب الرف العربي: 61 مسلسلاً تركياً، دراما أردية، سينما هندية رسمية، رفوف فلبينية وإندونيسية لمن يشارك الشقة. ثلاث عشرة لغة لأن البيت الخليجي نادراً ما يكون لغة واحدة.

#### الرف العربي القانوني، من غير أسطورة

- **شاهد.** البيت الأول للدراما العربية الجديدة. فيه مسار مجاني بإعلان ومسار مدفوع. العمل الذي تتحدث عنه التويتر هذا الأسبوع يعيش هناك.
- **منصات المحطات.** أبوظبي للإعلام وغيرها ترفع أرشيفاً خليجياً وشامياً على تطبيقاتها الرسمية. مجاني في أحيان كثيرة. ثبّتها من المتجر، لا من ملف.
- **البث المفتوح.** محطات عربية ما زالت تُبث مجاناً. وسکو يضمّ الحيّ منها بعد فحص كل ست ساعات. القناة التي تموت تُخفى.
- **يوتيوب الرسمي.** منتجون ومحطات يرفعون مواسم كاملة. هذا قانوني حين تكون القناة هي صاحب الحق. ليس قانونياً حين يعيد حساب مجهول رفع الملف.
- **وسکو.** فهرس لما يمرّ على الفحص في الدول الست. بلا حساب. إعلان واحد في الصفحة، ليس على المشغّل. قائمة المشاهدة على الجهاز.

إن غاب عنوان عن كل مسار رسمي، فهو في العادة خلف عقد، لا «ضائع».

#### البيت المصري والبيت الشامي ليسا بحثاً واحداً

البيت المصري في الخليج يطلب في الغالب المسلسل الرمضاني والمسارح والأعمال الطويلة التي يعرف أسماءها من القاهرة. كثير من ذلك يجلس على شاهد أو على قنوات المنتجين. لا نختلق أرشيف القاهرة كي نملأ صفحة.

البيت الشامي يطلب أعمالاً سورية ولبنانية يعرف وجوهها. رفّنا يحمل 73 عملاً سورياً و52 لبنانياً و26 أردنياً مرّت على الفحص. هذا أرشيف، لا موسم أول يعرض الليلة.

البيت الخليجي — كويتي وإماراتي وقطري وبحريني — يجد اللهجة التي تُفهم بلا ترجمة على الرف الكويتي أولاً (121 عملاً). هذه ليست تراتبية قيمة. هذه خريطة ما هو قانوني ومجاني عندنا الليلة.

#### العلبة، بجملة واحدة

العلبة تعد بـ«كل القنوات». هي لا تدفع لصاحب الحق، ولا تبقى بعد تحديث أمازون، ولا تحمي الهاتف. نحن لا نبيع قائمة، ولا نفتح جدار beIN، ولا نضع رقم واتساب تحت اسم قناة.

إن كان المساء مباراة، ادفع للمنصة التي تملكها. الصدق هنا أوفر من علبة تحترق في الدقيقة تسعين.

#### كيف تبدأ هذه الليلة

1. افتح [whisco.tv/arabic](https://whisco.tv/arabic) من شبكة خليجية.
2. إن كنت تريد عملاً جديداً لهذا الأسبوع على شاهد، اذهب إلى شاهد.
3. إن كنت تريد أرشيفًا قانونياً بلا حساب، ابق هنا.
4. أضف عنواناً إلى قائمتك. تبقى على الجهاز. ليس لدينا ملف لك في السحابة، لأن التطبيق في إصداره الأول لا يجمع بيانات.
5. إن انقطع بث قناة، انتظر دورة الفحص أو اكتب إلى legal@whisco.tv. لا تبحث عن «بديل» في مجموعة.

رمضان أعلى شهور التلفزيون في هذه الشقق. شاهد يملك العمل الجديد. نحن الغرفة الأخرى: الأرشيف العربي، والدزي المكتمل، والمسار الأردني والهندي لمن يشارك السرير والريموت. مواقيت الإفطار ليست لنا. خذها من مسجدك.

**EN synopsis.** Written for Egyptian and Levantine households *in the GCC*, not for viewers in Cairo or Damascus. Uses the real Arabic-shelf split (KW 121 / SY 73 / LB 52 / AE 42 / JO 26 / QA 15 / BH 1). Sends this week’s original to Shahid. Anti-pirate without a lecture. Points at `/arabic`, device-local watchlist, Ramadan cohabitation with Shahid.

---

## 4. RTL implementation notes (Next.js + Tailwind)

Executable by the same two-person team. No new design system.

### 4.1 Document direction

- Locale file: `ar` → `<html lang="ar" dir="rtl">`. Set in the root layout from the active locale, not hardcoded per page.
- Preferred: `next-intl` or a one-file locale switch that sets `dir` on `<html>`, never on a nested wrapper alone. Nested `dir="rtl"` inside an LTR app leaves the scrollbar and `position: sticky` nav on the wrong edge.
- Keep `dir="ltr"` on: the video player chrome (seek bar, time codes), embedded YouTube, code, emails, raw URLs, and any Latin-only admin screen.
- Language switcher stores `whisco_locale=ar` in a first-party cookie. Apps v1 collect no data — web cookie only, documented in the privacy page.

### 4.2 Tailwind mirroring

Use **logical properties**. Ban new `ml-` / `mr-` / `left-` / `right-` / `pl-` / `pr-` / `text-left` / `text-right` in components that render in both locales.

```tsx
// yes
className="ms-4 pe-3 text-start border-s"

// no
className="ml-4 pr-3 text-left border-l"
```

| Physical (retire) | Logical (use) |
|---|---|
| `ml-` / `mr-` | `ms-` / `me-` |
| `pl-` / `pr-` | `ps-` / `pe-` |
| `left-` / `right-` | `start-` / `end-` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l` / `rounded-r` | `rounded-s` / `rounded-e` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `float-left` | `float-start` |
| `space-x-4` | `space-x-4 rtl:space-x-reverse` |

Chevrons and back-arrows: use a component that flips with `rtl:-scale-x-100`, except media-transport icons (play stays pointing “forward” into the file, which is a triangle to the right even in RTL — this is the Gulf-app convention used by Shahid and YouTube AR).

Do not `transform: scaleX(-1)` the logo or the dog.

Grids of posters do not need mirroring beyond gutter logic. Carousels should start at the right in `ar` (`flex-row-reverse` or a library `dir` prop).

### 4.3 Mixed LTR inside an Arabic sentence

Turkish, Hindi, English titles and episode codes will appear inside Arabic UI. Isolate them or the punctuation crawls.

```tsx
<p>
  مسلسل{' '}
  <bdi lang="tr">Emanet</bdi>
  {' '}مكتمل — 800 حلقة.
</p>
```

Rules:

1. Wrap every foreign proper title in `<bdi>` (or `<span dir="auto">`). `<bdi>` is enough; do not nest `dir="ltr"` unless the title itself contains digits-plus-hyphen that flip (`S02-E14`).
2. Keep the original orthography. Do not invent `إيمانيت` for *Emanet*. An Arabic marketing name exists only when a rights holder published one (`قيامة أرطغرل`, not a volunteer transliteration of a new title).
3. Numbers and `HD` / `4K` / `TV` stay Latin.
4. URLs always LTR: `<span dir="ltr" className="inline-block">whisco.tv/turkish</span>`.
5. Patron legal names: use the lock-up they send. If the lock-up is Latin, isolate it. Do not force `باتلكو` if they print `Batelco` — both appear in the wild; the IO decides.

CSS insurance on title nodes:

```css
.title-foreign {
  unicode-bidi: isolate;
  direction: ltr;
}
```

### 4.4 Fonts for a dark premium UI

Brand field is `#0a0a0f` with orange `#f97316` → pink `#db2777`. Arabic type must look like the same product, not like a government portal.

| Role | Font | Why |
|---|---|---|
| **UI + headings (ship)** | **IBM Plex Sans Arabic** (400 / 500 / 600) | Grotesque that matches a Latin geometric sans. D&AD-recognised. Holds weight on dark grounds without inking shut. Self-host woff2, subset `unicode-range` Arabic. |
| **Latin companion** | Whatever the site already uses for EN; if unset, **IBM Plex Sans** so AR/EN share a family. Inter is acceptable. | Do not pair a humanist Latin with a Naskh Arabic. |
| **Long-form guides** | Same Plex Arabic at 400, size 18–20px, `line-height: 1.85`. | Naskh (Noto Naskh Arabic) is prettier for print Qur’anic colour and wrong for a streaming guide. |
| **Fallback stack** | `"IBM Plex Sans Arabic", "Noto Sans Arabic UI", "Segoe UI", Tahoma, sans-serif` | Noto Sans Arabic **UI** has shorter ascenders, better in buttons than Noto Naskh. |
| **Do not ship in chrome** | Cairo, Tajawal, Almarai as *primary* | Common, readable, and they make the site look like every Saudi landing page. Acceptable as last-resort fallback only. |
| **Do not ship** | Traditional Diwani / Kufic display faces on buttons | Festival-poster energy. Conflicts with anti-hype. |

`next/font` sketch:

```ts
import { IBM_Plex_Sans_Arabic } from "next/font/google";

export const plexAr = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-ar",
});
```

Self-host if Google Fonts is blocked on a guest network; the IBM/plex `woff2` files are the same metrics.

Optical notes on `#0a0a0f`:

- Avoid 300 / Thin. Hairlines disappear on OLED.
- Tracking: `letter-spacing: 0` for Arabic. Never apply the English heading tracking to AR strings.
- Button padding: Arabic script needs ~8–12% more inline padding than the English twin or the text kisses the edge.
- `font-feature-settings` stay default. Do not enable discretionary ligatures.

### 4.5 Components that lie in RTL if you forget them

- Search field magnifying glass: put it at `start`, not `left`.
- “Watch now” + duration chip: chip goes at `end`.
- Toast “تم النسخ”: lower-`start`, not lower-left.
- Modal close “×”: `end` of the header.
- Live red dot + `مباشر`: dot stays start-side of the word.
- Ad slot: still one per page, still ≥24px from the player. RTL does not move it onto the player.
- App screenshot overlays for stores: produce a second set. Flipping an English screenshot in Photoshop is visible and looks like a grey APK.

### 4.6 QA checklist before an AR release

1. `<html dir="rtl" lang="ar">` on every public AR URL.
2. No English orphan in chrome (nav, empty states, 404). Catalog titles may stay Latin.
3. WhatsApp share preview still LTR-safe (URL on its own line).
4. Patron credit order remains preamble → name → quiet line → mark, even though the line reads right-to-left.
5. Geo-hide copy reviewed on a non-GCC IP.
6. A Bahraini or Gulf Arabic speaker reads the About page and both guides once. This pack is operator-ready, not a substitute for that pass.

---

## 5. Debatable strings — decision log

Ship the **Preferred** column unless Ali marks otherwise. Rejected options are written so a future translator does not “fix” them back.

| # | EN / concept | Preferred AR | Rejected / alt | Why |
|---|---|---|---|---|
| 1 | Whisco TV (wordmark text) | وسکو تي في | ويسكو، هويسكو، وسكيو | `وسکو` matches the Ramadan bible lock-up and the long ō. Do not vowel it `وِسْكُو` in UI. |
| 2 | On Demand | عند الطلب | حسب الطلب، أون ديماند | Matches Shahid/OSN AR chrome. |
| 3 | Live TV | بث مباشر | التلفزيون المباشر، لايف | Shorter nav. Page H1 may use `التلفزيون المباشر`. |
| 4 | My List | قائمتي | قائمة المشاهدة، مفضلتي | Width. `مفضلتي` sounds like a heart, not a queue. |
| 5 | Guides | الأدلة | الإرشادات، المقالات | We write guides, not help-centre articles. |
| 6 | Watch now | شاهد الآن | شغّل الآن، مشاهدة | Verb on buttons. `شغّل` is what the player does after the tap. |
| 7 | Player | المشغّل | البلاير، مشغل الفيديو | One word. Keep the shadda. |
| 8 | Geo-restricted | غير متاح في بلدك | محظور جغرافياً، محجوب في منطقتك | Availability, not a ban. |
| 9 | Patron | دعم | راعٍ، شريك، راعي رسمي | `راعٍ` is the regulator-facing synonym. Never `شريك حصري`. |
| 10 | Hub / shelf / room | ركن / رف / غرفة | قسم، قناة، فضاء | Patronage copy uses `ركن`. Programming copy uses `رف` or `غرفة`. Do not mix three words on one page. |
| 11 | dizi | دزي | مسلسل تركي only, ديزي | First mention: `مسلسل تركي (دزي)`. Later: `دزي`. `ديزي` reads as Daisy. |
| 12 | Legal | قانوني | شرعي، مرخّص حصراً | `شرعي` collides with religious register. `مرخّص` over-claims titles that are FTA/public-domain. |
| 13 | Pirate box / Firestick loaded pack | العلبة | جهاز القرصنة، الستك | Household word in the Gulf. `ستك` is fine in a guide after first mention of Fire TV. |
| 14 | Free-to-air | بث مفتوح / بث أرضي مجاني | فري تو إير | Short label `بث مفتوح`. |
| 15 | Sign up / account | بلا تسجيل | بلا حساب، من دون إنشاء حساب | `تسجيل` is the verb people fear. |
| 16 | Built in Bahrain | صُنع في البحرين | مبني في البحرين، من البحرين | Footer length. About page may use `مبني في البحرين على يد…`. |
| 17 | Founder name | علي البحرانة | علي البحارنة، Ali Albaharna only | Confirm before AR-first About. Latin remains on legal IO. |
| 18 | Shih Tzu | شيه تزو | شي تزو، شيتسو | One mention, then the dog is وسکو. |
| 19 | Shahid (competitor) | «شاهد» | شاهد without marks | Always marked when our verb `شاهد` is nearby. |
| 20 | Evenings on Whisco | أمسيات وسکو | سهرات وسکو، ليالي وسکو | Locked. `سهرة` is a single night; `أمسيات` is the month. |
| 21 | Malayalam | المالايالامية | الماليالامية | Prefer doubled yā; search synonym the short form. |
| 22 | Copy message | انسخ الرسالة | نسخ الرسالة، انسخ الرابط | The share sheet copies a caption, not just a URL. |
| 23 | Buffering | جارٍ التجهيز | جارٍ التخزين المؤقت | The long form looks like a failure. |
| 24 | Public domain | ملك عام | متاح للجميع، بدون حقوق | `بدون حقوق` is false. |
| 25 | Data Not Collected | لا تُجمع بيانات | لا نجمع أي بيانات على الإطلاق | Store label should stay close to Apple/Google AR boilerplate. |
| 26 | Tagline «Life's better at full speed — and full free.» | الحياة أطيب بأقصى سرعة… ومجانية تماماً | الحياة أفضل بأقصى سرعة ومجانية | `أطيب` is warmer than `أفضل` and less corporate. Still optional — do not force the tagline onto AR chrome if it feels copied. The product sentence in §2.1 is enough. |
| 27 | App Store keyword `افلام` without hamza | افلام | أفلام | Connect search is hamza-blind more often than not; the field drops the hamza to match how thumbs type. Prose keeps `أفلام`. |
| 28 | Western digits | 581، 15,696 | ٥٨١ | UI convention in Gulf apps. Guides may use either; stay consistent inside one page. |

---

## 6. File drop list (engineering)

One JSON namespace is enough. Suggested keys match the EN source.

```json
{
  "nav.home": "الرئيسية",
  "nav.live": "بث مباشر",
  "nav.ondemand": "عند الطلب",
  "nav.new": "الجديد",
  "nav.myList": "قائمتي",
  "nav.guides": "الأدلة",
  "action.watchNow": "شاهد الآن",
  "action.share": "مشاركة",
  "action.copyMessage": "انسخ الرسالة",
  "action.addToList": "أضف إلى قائمتي",
  "player.loading": "جارٍ التحميل…",
  "player.unavailable": "غير متاح الآن",
  "player.geoRestricted": "غير متاح في بلدك",
  "search.placeholder": "ابحث عن عنوان أو قناة أو لغة",
  "footer.tagline": "تلفزيون قانوني مجاني لبيوت الخليج"
}
```

Do not add keys for Sign in or Subscribe.

---

*End of pack. A Gulf Arabic speaker reads About + both guides before anything AR-first goes public. Catalog numbers refresh on the January recount.*
