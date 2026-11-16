# PRODUCT_REQUIREMENTS.md — Bijli Dost

**Tagline:** آپ کا بجلی کا بل، اب آسان!  
**Version:** 0.2.0 (Local-First MVP Architecture)  
**Initial Market:** Karachi, Pakistan (K-Electric)  
**Languages:** Urdu (`ur` — primary, RTL), Roman Urdu (`ur-Latn`), English (`en`)

---

## 1. Product Vision & Scope

Millions of Pakistani households receive monthly electricity bills filled with dense English abbreviations (`kWh`, `FCA`, `QTA`, `FPA`, `ED`, `GST`, `TVL`, `LPS`), multi-tier slab tables, and fine print. Ordinary consumers—especially elderly users and those with limited English literacy—struggle to understand:
- Why their bill increased this month compared to last month.
- How many units (`kWh`) they consumed and when the due date is.
- What major charges make up their total payable amount.
- Where and how to contact their utility provider if they have a genuine billing or meter issue.

**Bijli Dost** turns a confusing paper or PDF utility bill into a clear, calm, spoken and visual explanation in simple Urdu, Roman Urdu, and English.

### Local-First Architecture Mandate
For the initial MVP:
- **Zero Mandatory Authentication & Zero User Accounts**: Users open the app and immediately scan or enter bills.
- **Local-Only Storage**: All bill records, images (if retained), and preferences live strictly on the user's device.
- **No Cloud Database or Cloud Backup in Initial MVP**: Supabase (or any cloud database/auth service) is intentionally excluded from the initial MVP to keep the application lean, zero-cost to run, and privacy-preserving. The storage layer is abstracted so cloud sync can be plugged in as an optional future enhancement.
- **Versioned Local Tariff Configurations**: Tariff configs are versioned, effective-dated local JSON files validated via Zod schemas. Future updates will be reviewed by humans and distributed via app updates or static CDN downloads. No tariffs are invented.

### Long-Term Expansion Roadmap (Post-MVP)
1. Optional cloud backup and multi-device sync (opt-in).
2. Other Pakistani electricity DISCOs (LESCO, IESCO, MEPCO, FESCO, GEPCO, HESCO, SEPCO, QESCO, PESCO, TESCO).
3. Natural gas bills (SNGPL, SSGC).
4. Water & municipal utility bills (e.g., KW&SC).

---

## 2. Target Audience & Constraints

| Persona | Needs & Constraints |
|---|---|
| **Household Head (Limited English)** | Needs Urdu-first explanations, zero jargon, clear "Total Bill" and "Due Date" at a glance. |
| **Elderly Consumer** | Needs large text, high contrast, large tap targets, and **Urdu voice readout (TTS)** in natural Nastaliq typography so they don't have to read small print. |
| **Younger Family Member Helping Parents** | Wants quick camera scan, Roman Urdu or English toggle, and monthly unit comparison charts. |
| **Budget Android User** | Uses 2–4 GB RAM Android devices on intermittent 3G/4G; app must be lightweight, fast, work 100% offline, and require no account creation. |

---

## 3. MVP Feature Requirements (12 Core Features)

### F1. Welcome & Language Selection
- First-launch onboarding with 3 large, clear cards: **اردو (Urdu)**, **Roman Urdu**, **English**.
- Immediate language + RTL/LTR switch without requiring sign-up, sign-in, or internet connectivity.
- Short 2-step privacy & independence notice: *"Bijli Dost is an independent helper app, not affiliated with K-Electric. All data stays on your phone."*

### F2. Simple Home Dashboard
- At most 3–4 primary actions/cards to avoid clutter:
  1. **Scan New Bill** (primary large CTA, >=56 dp).
  2. **Latest Bill Summary** (Total Payable, Due Date countdown, Units Consumed, Status badge).
  3. **Monthly Units Trend** (quick preview / link to comparison).
  4. **Quick Help / Complaints** & **Bill History**.

### F3. K-Electric Bill Scanning
- Capture bill photo using **Expo Camera** with a simple rectangular alignment guide and flash toggle.
- Alternative: Pick existing bill image/screenshot from gallery using **Expo Image Picker**.
- Clear visual tips in Urdu/Roman Urdu/English (e.g., *"روشنی اچھی رکھیں — بل سیدھا رکھیں"*).

### F4. Bill Image Cropping & Correction
- Allow user to crop, rotate (90° steps), and retake before running OCR.
- Automatic image resizing/compression to keep memory low on budget Android devices and improve OCR legibility.

### F5. OCR Bill Field Extraction (Abstracted)
- Extract key K-Electric bill fields:
  - Consumer / Account Reference (masked/verified by user)
  - Billing Month & Year
  - Due Date
  - Units Consumed (`kWh`)
  - Payable Within Due Date & Payable After Due Date
  - Meter Number & Tariff Category (e.g., Residential A-1R)
  - Itemized Charges (Electricity Cost, Fuel Adjustments, Taxes/Duties, Fixed/TV charges)
  - Unrecognized / Unknown line items (preserved without deletion)
- Per-field confidence score (`high`, `medium`, `low`, `missing`) and bounding-box evidence.
- Concrete OCR implementation chosen after structured evaluation against sample bills; works 100% offline.

### F6. Manual Correction of Extracted Values (Mandatory Gate)
- Mandatory review screen before saving or analyzing.
- Fields with `low` or `medium` confidence are visually highlighted in amber with simple prompts (*"براہ کرم چیک کریں"* / *"Please verify"*).
- Minimal typing: numeric keypad for amounts/units, date picker for due date, simple chips for tariff category.

### F7. Deterministic Electricity Bill Explanation
- Plain-language breakdown of the bill in Urdu, Roman Urdu, and English:
  - **What you used**: Units (`kWh`) and comparison to previous month.
  - **Where the money goes**: Plain-language explanation of Electricity Charges, Fuel/Quarterly Adjustments, Taxes/Duties, and Fixed/TV charges (only for fields verified from official tariff docs & sample bills).
  - **Preservation of unclassified items**: Unrecognized line items are displayed under an "Other Charges" section, never dropped or guessed.
  - **Clear status labels**: Verified vs. Estimated / Unverified.
  - **No unverified accusations**: Never claim a bill is incorrect or overcharged without deterministic, verifiable evidence. Never use an LLM for financial math.

### F8. Monthly Unit Comparison
- Visual bar/line chart (`react-native-svg`) comparing the last 6–12 months of `kWh` units and bill amounts.
- Simple delta callout: *"اس ماہ 45 یونٹ زیادہ استعمال ہوئے"* (*"45 more units used this month"*).

### F9. Urdu Text-to-Speech (Voice Assistant)
- One-tap **"سنیں / Listen"** button on the Bill Explanation screen.
- Speaks a natural, concise summary in Urdu (or English/Roman Urdu fallback based on device TTS voices) with Play, Pause, and Stop controls.

### F10. Due-Date Reminders
- Local scheduled notifications (`expo-notifications`) 3 days before, 1 day before, and on the morning of the due date (user-configurable).
- Works 100% offline without requiring push-notification servers.

### F11. Basic Complaint Guidance
- Step-by-step guidance for common issues (e.g., Meter reading mismatch, High bill check, Damaged meter, Power outage) with official public K-Electric helpline/channel references (`118`, SMS/WhatsApp/website links) and a checklist of what to keep ready before calling.
- Does **not** submit complaints on behalf of the user or ask for KE credentials.

### F12. Local Bill History & Data Management
- Local-first list of past scanned/entered bills sorted by billing month.
- Filter/view by month, view saved breakdown, delete individual bills, or mark a bill as "Paid" locally.
- Explicit data management: Users can clear all history with one tap or export a summary.
- Clearly communicate backup limitation: *"All records are stored on this device. Uninstalling the app will clear saved bill history."*

---

## 4. Explicit Non-Goals for Initial MVP

- No user registration, passwords, SMS OTPs, or cloud accounts.
- No Supabase / cloud database dependencies in MVP v1.
- No K-Electric account login, password, or OTP collection.
- No in-app bill payment processing.
- No live meter-reading scraping from utility portals.
- No AI chatbot or LLM-based bill math.
- No multi-utility (gas/water) or non-KE DISCO support in MVP v1 (architecture must support them cleanly later).
