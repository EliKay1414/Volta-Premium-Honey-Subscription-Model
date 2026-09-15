# Vivaldi Admin — Honey Subscription & Deliveries Portal

A specialized React + TypeScript administrative dashboard designed for the **Vivaldi Volta Premium Honey Subscription Business Model**.

---

## Core Features

- **Dashboard Overview**: Live dynamic figures tracking Active Subscribers, Total Bottles Delivered, Monthly Recurring Sales in Ghana Cedis (GH₵), Repeat Buyer Loyalty Rate, and real-time Bottle Size preference distribution (500g vs 330g plastic bottles).
- **Subscribers Management**: Comprehensive registry of honey buyers across Ghana's 16 regions with plan types (Monthly / Annual Saver), bottle quantities, frequencies, payment methods (MTN MoMo, Telecel Cash, Card, Cash on Delivery), support agent allocations, and subscription status controls.
- **Honey Orders**: Real-time order tracking with bottle sizes, SKU codes (`VIV-500-PL`, `VIV-330-PL`), delivery statuses (Packing, On the Way, Delivered), payment statuses, and CSV export capabilities.
- **Vendor Deliveries**: Dispatch schedule and logistics monitoring with driver details, perimeter distance tiers, and fee calculations.
- **USSD Prospects (*713*65#)**: Incoming customer lead verification workflow allowing support agents to verify registrations and seamlessly convert prospects into active buyers.
- **Team & Users**: Access control and profiles for Administrators and Subscriber Support staff.
- **Persistent State**: Reactive cross-tab and cross-component persistence via `usePersistentState`, ensuring all client-side changes stay saved across browser refreshes.

---

## Development & Build

### Development Server
```bash
npm run dev
# or
npm start
```

### Production Build
```bash
npm run build
```

The production output will be generated cleanly in `dist/`.
