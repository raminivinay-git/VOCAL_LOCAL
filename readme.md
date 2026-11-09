# Vocal Local 🏪🎙️

> **A Unified, Voice-First Hyperlocal Commerce Ecosystem for Local Retailers & Neighborhood Communities**  
> *Built for Hackathon Track 05: Local Business & Livelihoods*

[](https://github.com)
[](https://github.com)
[](https://github.com)

---

## 📌 Problem Statement

Small-scale local retailers—including neighborhood kirana stores, street vendors, and fresh produce sellers—struggle to digitize their businesses. Modern e-commerce platforms impose complex, time-consuming inventory management systems that require manual SKU entry, barcode scanning, and multi-step catalog forms.

As a result:
1. **Unorganized Retailers Lose Market Share:** Millions of local shopkeepers lose footfall to centralized quick-commerce aggregators (Zepto, Blinkit, Instamart).
2. **Consumers Pay Inflated Prices:** Quick-commerce platforms charge 20%–30% commissions alongside packaging and handling fees, inflating household grocery bills.
3. **Hyperlocal Wealth Drains Away:** Transaction profits flow to distant aggregators rather than circulating inside local neighborhood economies.

---

## 💡 Our Solution

**Vocal Local** is a unified, voice-first hyperlocal e-commerce ecosystem that connects unorganized local vendors directly with neighborhood customers in a single web application.

Rather than building fragmented, disconnected apps, LocalVyapar leverages **Role-Based Access Control (RBAC)** to deliver three seamless experiences from one centralized operational core:

```
                          ┌──────────────────────────┐
                          │   Vocal Local Platform   │
                          │   (Central State Core)   │
                          └─────────────┬────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
   [ 🏪 Vendor Mode ]         [ 🛒 Customer Mode ]       [ 🛵 Delivery Mode ]
   • AI Voice Assistant       • Hyperlocal Catalog       • Live Dispatch Radar
   • Zero-Typing Inventory    • Direct Local Pricing     • Rapid Pickup & Drop
   • 1-Tap 'Go Live'          • Transparent Checkout     • Milestone Status Sync
```

---

## ✨ Core Features & Role Breakdown

### 1. 🏪 Vendor Mode *(The USP)*
* **Zero-Typing Voice Inventory:** Shopkeepers tap the microphone and dictate their daily stock naturally in everyday speech (e.g., *"10 packets of milk at 32 rupees, 5 kilos of onions at 40 rupees"*).
* **Browser-Native NLP Parser:** Audio transcripts are parsed in real time into structured digital catalog cards (Item Name, Category, Quantity, Unit, Price).
* **One-Tap 'Go Live':** Review the parsed items and tap **Confirm** to publish them live to nearby customers instantly.
* **Ambient Noise Keypad:** Quick manual +/- adjustments ensure vendors can adjust stock even in noisy open-air markets.

### 2. 🛒 Customer Mode
* **Hyperlocal Discovery:** Browse neighborhood kiranas and artisan stalls within a 15-minute delivery radius.
* **True Local Store Pricing:** Eliminates the 20%–30% aggregator margin, delivering daily essentials at fair, budget-friendly prices.
* **Direct Order Flow:** Clear cart breakdown with one-tap order submission and direct WhatsApp dispatch integration.

### 3. 🛵 Delivery Mode
* **Real-Time Dispatch Radar:** Incoming orders instantly alert local delivery executives with vendor landmark and delivery destination.
* **Fast Turnaround:** Short hyperlocal travel radiuses enable rapid sub-15-minute delivery execution.
* **Milestone Tracking:** Live status transitions (`Accepted` ➔ `Picked Up` ➔ `Delivered`) synchronize vendor prep and customer tracking.

---

## 🏗️ Technical Architecture & Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | HTML5, Tailwind CSS, Vanilla JS / React | Lightweight, mobile-first responsive UI with zero heavy build dependencies. |
| **Voice Engine** | Web Speech API (`webkitSpeechRecognition`) | Runs directly inside Chrome/Edge; zero server latency, zero API costs, and full privacy. |
| **Entity Parser** | RegEx & Keyword Extraction Engine | Extracts item quantities, standard units (kg, g, packet, litre), and currency amounts. |
| **Communication / Checkout** | WhatsApp Click-to-Chat Deep Linking (`wa.me`) | Frictionless communication channel already installed on 95%+ of Indian vendor phones. |
| **State Synchronization** | Centralized Reactive In-Memory State & Event Bus | Ensures instant synchronization between vendor inventory updates, customer cart, and delivery radar. |

---

## 🚀 Quick Start & Installation

Vocal Local is built to run immediately in any modern web browser without complex setup.

### Prerequisites
* Google Chrome, Microsoft Edge, or Safari (Chrome/Edge recommended for full Web Speech API compatibility).
* Microphone permissions enabled in browser settings.

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohansrimanthtalla/Vocal_Local.git
   cd Vocal_Local
   ```

2. **Open the application:**
   * **Direct Browser Launch:** Simply double-click `index.html` or drag it into any open Chrome window.
   * **Or via a lightweight local server:**
     ```bash
     # Using Python
     python3 -m http.server 3000
     
     # Or using Node.js
     npx serve .
     ```
   * View on
    ```
     https://raminivinay-git.github.io/VOCAL_LOCAL/  

     ```
      this browser
3. **Grant Microphone Access:** When switching to **Vendor Mode** and clicking the microphone button, grant audio permissions to test live voice dictation.

---

## 🎬 3-Minute Hackathon Demo Script

Follow this sequence when presenting to hackathon judges:

1. **The Hook (30 sec):** Explain how quick-commerce giants squeeze 25% margins from small kirana owners while overcharging families. Introduce LocalVyapar's voice-first solution.
2. **Vendor Live Voice Demo (60 sec):**
   * Switch to **Vendor Mode**.
   * Click the pulsing mic and speak:  
     > *"Add 10 packets Amul milk at 32 rupees and 5 kilos basmati rice at 120 rupees."*
   * Show the voice engine parsing speech into draft inventory cards.
   * Tap **Confirm & Go Live**.
3. **Customer Live Demo (45 sec):**
   * Switch to **Customer Mode**.
   * Highlight the freshly published milk and rice appearing instantly in the storefront.
   * Add items to the basket and click **Order via WhatsApp**.
4. **Delivery Live Demo (30 sec):**
   * Switch to **Delivery Mode**.
   * Show the incoming order radar pinging with pickup and drop details.
   * Tap **Accept Order** and progress it to **Out for Delivery**.
5. **Impact Summary (15 sec):** Emphasize how zero-typing technology brings millions of unorganized retailers into the digital economy without technical friction.

---

## 👥 Team & Roles

| Team Member | Role | Key Contributions |
| :--- | :--- | :--- |
| **[Talla Mohan Srimanth]** | Voice AI & Parsing Lead | Web Speech API integration, regex entity parser, dictation fallbacks |
| **[Ramini Vinay]** | Frontend & UX Lead | Responsive customer storefront, cart drawer, Tailwind UI components |
| **[Majji Guna Sekhar]** | Logistics & State Lead | Delivery radar dashboard, real-time RBAC synchronization, PWA setup |
| **[Moida Jitendra Kumar]** | Product & Pitch Lead | User journey mapping, market sizing, slide deck, demo coordination |

---

## 📄 License & Acknowledgments

* **Hackathon Track:** Track 05 — Local Business & Livelihoods
* Built with ❤️ for neighborhood shopkeepers and street vendors.
