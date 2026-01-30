# EduGrade Pro: Intelligent Academic Analytics

A sophisticated management system engineered for academic performance tracking and pedagogical data analysis. This platform bridges the gap between raw data entry and actionable educational insights through high-fidelity visualizations and generative AI.

## Core Capabilities

- **Statistical Intelligence**: Real-time calculation of class averages, peak performance identification, and low-range metrics.
- **AI Performance Diagnostics**: Deep integration with Google Gemini for generating contextual summaries and teaching recommendations based on grade distributions.
- **Dynamic Visualizations**: Responsive charting for immediate identification of class-wide performance trends.
- **Professional Reporting**: Structured data views optimized for academic documentation and record-keeping.
- **Responsive Architecture**: Mobile-first design for cross-platform data management.

## Technical Foundation

- **Frontend Core**: React 19 with TypeScript for robust, type-safe development.
- **Intelligence Engine**: `@google/genai` implementation utilizing the `gemini-3-flash-preview` model.
- **UI & Styling**: Tailwind CSS utilizing the Inter font family for a clean, modern aesthetic.
- **Data Graphics**: Recharts engine for SVG-based performance distribution mapping.
- **Modular Design**: Atomic component structure with dedicated service layers for AI communication.

## System Architecture

- `App.tsx`: Central logic orchestrator and state management.
- `services/geminiService.ts`: Specialized layer for AI inference and JSON schema-based response handling.
- `components/StatsCard.tsx`: Reusable data visualization unit for key performance indicators.
- `types.ts`: Universal interface definitions ensuring data integrity across the system.

## Performance Features

- **Zero-Latency State Updates**: Immediate reflection of grade changes in visual charts.
- **Conditional Formatting**: Dynamic color-coding based on academic performance thresholds (Emerald for 90+, Amber for 60-75, etc.).
- **Print Optimization**: Dedicated CSS considerations for physical report generation.

## Requirements

The intelligence features require a valid `API_KEY` provided via environment variables to interface with the Google GenAI infrastructure.
