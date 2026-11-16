# BILL_ANALYSIS_RULES.md — Bijli Dost

**Status:** Governance & Analysis Specification — **Tariff values intentionally NOT populated yet.**

---

## 1. Fundamental Rules & Invariants

1. **Independent, Pure TypeScript Engine**: The calculation engine (`src/engines/bill-analysis/`) must have **zero imports from React Native, Expo, or native packages**. It must execute purely in Node.js and Jest.
2. **100% Deterministic Calculations**: All mathematical operations (tariff slab computations, fuel adjustments, taxes, duties, late surcharges, and monthly deltas) must be pure, deterministic TypeScript functions backed by versioned tariff tables.
3. **Never Use AI / LLMs for Financial Math**: Under no circumstances may an LLM or probabilistic model compute bill totals, slab breakdowns, taxes, or unit costs, or determine whether a bill is "correct" or "incorrect".
4. **No Invented Tariffs or Taxes**: Rates, slab thresholds, FCA, QTA, GST rates, Electricity Duty, TV License fees, and income tax formulas must be sourced exclusively from verified official NEPRA and K-Electric gazette notifications.
5. **Gated Implementation**: The analysis engine calculations will not be implemented until:
   - Official NEPRA / K-Electric tariff schedule PDFs for the effective period are reviewed.
   - At least 5–10 real, anonymized K-Electric sample bills are inspected to verify exact naming, rounding, and slab indexing rules.

---

## 2. Unclassified Line-Item Preservation

Pakistani utility bills frequently introduce temporary surcharges, one-off adjustments, or regional levies (e.g. PHL surcharge, prior-year arrears, staggered FCA installments).

**Mandatory Rule:** Any line item or charge extracted from the bill that does not map directly to a known canonical category (Variable Charges, Fuel Adjustment, Government Taxes, Fixed Charges) **must NOT be dropped, ignored, or forced into an arbitrary category**.

- The engine must preserve all unknown items in an `unclassifiedLineItems` array:
  ```typescript
  export interface UnclassifiedLineItem {
    rawLabel: string;
    amount: number;
    ocrConfidence: 'high' | 'medium' | 'low';
    evidenceText: string;
  }
  ```
- In the Bill Explanation UI, these are explicitly presented in an *"Other Charges on Your Bill / بل پر دیگر چارجز"* section with a neutral explanation.

---

## 3. Field-Level OCR Confidence & Evidence

Every field extracted by the OCR pipeline carries a confidence rating and evidence trace:

```typescript
export type FieldConfidence = 'high' | 'medium' | 'low' | 'missing';

export interface FieldEvidence<T> {
  value: T;
  confidence: FieldConfidence;
  rawText: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  userOverridden: boolean;
}

export interface ExtractedBillDraft {
  consumerReference: FieldEvidence<string>;
  billingMonth: FieldEvidence<string>;
  dueDate: FieldEvidence<string>;
  unitsKwh: FieldEvidence<number>;
  amountWithinDueDate: FieldEvidence<number>;
  amountAfterDueDate: FieldEvidence<number>;
  meterNumber: FieldEvidence<string>;
  tariffCategory: FieldEvidence<string>;
  lineItems: FieldEvidence<Array<{ label: string; amount: number }>>;
  unclassifiedLineItems: UnclassifiedLineItem[];
}
```

### Mandatory Review Rules
- Any field with `confidence !== 'high'` (i.e. `medium`, `low`, or `missing`) is flagged with an amber warning on the **Manual Review Screen**.
- The user must explicitly inspect and confirm or edit all uncertain fields before the bill can be saved to history or passed into the analysis engine.
- Even fields with `high` confidence remain fully editable by the user.

---

## 4. Versioned, Effective-Dated Tariff Schema

Tariff configurations are modeled as immutable, effective-dated structures:

```typescript
export interface TariffSlab {
  minUnits: number;
  maxUnits: number | null; // null represents unbounded upper slab
  ratePerUnit: number;     // PKR per kWh
}

export interface KelectricTariffConfig {
  providerId: 'kelectric';
  tariffCode: 'A1-R';      // e.g. Residential
  isProtectedCategory: boolean;
  version: string;         // e.g. "2026-11-v1"
  effectiveFrom: string;   // ISO Date "2026-07-01"
  effectiveTo: string | null;
  officialNotificationRef: string; // NEPRA / Gazette reference
  slabs: TariffSlab[];
  fixedChargesPerMonth: number;
  electricityDutyRatePercent: number;
  gstRatePercent: number;
  tvFee: number;
}
```

### Tariff Reconciliation & Handling Missing Periods
- When a bill's `billingMonth` matches an active verified tariff config, the engine computes the expected breakdown and compares it against user-confirmed bill values.
- If no verified tariff configuration exists for that bill's date (e.g. an older bill from 2024 or a future period with unnotified rates), the engine:
  1. Sets `analysisStatus: 'UNVERIFIED_TARIFF_PERIOD'`.
  2. Displays the exact user-confirmed line items and totals as reported on the bill.
  3. Displays a calm, prominent notice: *"اس بل کے لیے سرکاری ریٹ شیڈول کی تصدیق موجود نہیں۔ صرف بل پر درج معلومات دکھائی جا رہی ہیں۔"* (*"Official rate schedule not verified for this bill period. Displaying values as reported on your bill."*).
  4. Never attempts to guess rates or fabricate breakdowns.

---

## 5. Evidence-Based Explanations & Claim Safety

1. **Never accuse the utility without proof**: Never state *"You have been overcharged"* or *"Your bill is wrong"*.
2. If `sum(itemizedCharges) !== totalPayable`:
   - Check if unclassified line items or arrears account for the difference.
   - Present the difference neutrally: *"There is an unclassified amount of Rs. X on this bill (such as past arrears or temporary surcharges). Check the itemized list below."*
3. **Clear Status Badges**:
   - Every bill analysis screen displays a clear badge:
     - **Verified Calculation**: Backed by matching official tariff schedule and user-confirmed readings.
     - **Estimated / Unverified**: Calculated without an active verified tariff schedule, or based on partial OCR data.
