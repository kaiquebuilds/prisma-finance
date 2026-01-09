# Prisma's User Stories

Below is a comprehensive list of user stories that define the functionality and features of Prisma. These stories are organized into epics to provide a clear structure for development and prioritization.

**This is by no means an exhaustive or final list** of every possible feature, but rather a focused set that aligns with our [North Star outcomes](north-star.md) and user needs.

## Epic 1: Onboarding and First-Run Setup

1.1 As Juliana, I want a guided first-run setup for my profile and accounts, so I don’t feel overwhelmed by an empty app and can start using Prisma with confidence.
1.2 As Juliana, I want Prisma to warn me when critical setup information is missing (e.g., accounts, key bills), so I don’t rely on inaccurate planning or Safe to Spend numbers.

## Epic 2: Authentication, Verification, and Account Recovery

2.1 As Juliana, I want to register using email and password and accept the Terms of Service and Privacy Policy, so I can create a secure account for my financial data.
2.2 As Juliana, I want to verify my email address, so I can activate my account and protect access to sensitive financial features.
2.3 As Juliana, I want to sign in with email and password, so I can access Prisma securely, while being blocked from sensitive financial features until my email is verified.
2.4 As Juliana, I want to request a new verification email without logging in, so I can recover from an expired/lost verification link.
2.5 As Juliana, I want to request a password reset link without revealing whether my account exists, so I can recover access safely and privately.
2.6 As Juliana, I want to set a new password using a valid reset link, so I can regain access to Prisma.

## Epic 3: Sessions and Trusted Devices

3.1 As Juliana, I want my session to end automatically after inactivity, so my financial data is protected if I leave my device unattended.
3.2 As Juliana, I want to stay signed in longer on a trusted device, so I can open Prisma quickly without re-entering my password every time.

## Epic 4: Profile and Account Settings

4.1 As Juliana, I want to view and update my display name, so the experience feels personal and I feel ownership over my account.
4.2 As Juliana, I want to upload, replace, or remove my profile picture, so I control my identity inside the app.
4.3 As Juliana, I want to change my password, so I can rotate credentials or secure my account if I suspect risk.
4.4 As Juliana, I want to request an email address change, so I can migrate my account to a new inbox securely.
4.5 As Juliana, I want to confirm my email change with a verification code sent to the new address, so unauthorized changes can’t take over my account.

## Epic 5: Privacy and “Public Mode”

5.1 As Juliana, I want to hide or show monetary values in Prisma, so I can use the app in public without exposing my financial status.

## Epic 6: Asset Accounts (Cash Containers) and Reconciliation

6.1 As Alex, I want to create an asset account with a starting balance, so Prisma tracks my money from a clear baseline.
6.2 As Juliana, I want to see my active accounts and current balances, so I can quickly understand where I stand today.
6.3 As Alex, I want to reconcile an asset account balance when needed without rewriting history, so the account stays accurate while preserving transaction integrity.
6.4 As Alex, I want to close an asset account safely, so I can keep my finances organized without losing meaningful history.
6.5 As Alex, I want a summary for an account over a selected date range, so I can understand whether I was net positive or negative during that period.
6.6 As Juliana, I want a way to bring Prisma’s balance back in line with my bank balance when something is off, so I can restore trust quickly without hunting for a single missing transaction.

## Epic 7: Transfers (Between Accounts and Paying Cards)

7.1 As Alex, I want to record a transfer between two asset accounts, so balances stay accurate without manually creating multiple entries.
7.2 As Juliana, I want to record paying my credit card bill from an asset account as a transfer-like action, so my cash decreases and my card debt decreases in a way that matches reality.

## Epic 8: Transactions (Ledger) and Transaction Details

8.1 As Juliana, I want to record an expense from an asset account, so I can track spending and keep balances accurate.
8.2 As Juliana, I want to record an income deposit into an asset account, so I can track earnings and keep balances accurate.
8.3 As Alex, I want to browse, search, and filter my transaction history, so I can audit my finances and find past payments quickly.
8.4 As Juliana, I want to edit or delete transactions safely, so I can correct mistakes without corrupting my financial history.
8.5 As Juliana, I want to undo an accidental deletion, so I don’t lose important data.
8.6 As Alex, I want to view full transaction details (including recurrence context), so I can understand totals over time and debug planning vs reality.

## Epic 9: Categories, Tags, and Categorization Automation

9.1 As Alex, I want to create and edit transaction categories, so my reports and budget reflect how I think about money.
9.2 As Alex, I want to remove a category I no longer use without breaking past transaction history, so my category list stays clean over time.
9.3 As Alex, I want to drill into a category to see its spending history and composition, so I can spot patterns and make improvements.
9.4 As Alex, I want to tag transactions with custom labels (e.g., Vacation 2024, Reimbursable), so I can group spending across categories and accounts for specific purposes.
9.5 As Juliana, I want Prisma to suggest a category based on the payee/description, so I spend less time typing and stay consistent.
9.6 As Alex, I want to define rules that auto-categorize transactions based on description/payee patterns, so I spend less time organizing data.
9.7 As Alex, I want categorization rules to run automatically during imports, so my staging area is already organized before I review.

## Epic 10: Recurrence Engine and Planned Items (Bills/Income/Transfers)

10.1 As Juliana, I want to create recurring rules for income, expenses, or transfers, so Prisma can prepare upcoming entries and reduce manual effort.
10.2 As Juliana, I want Prisma to generate upcoming planned items from my recurring rules automatically, so I can plan with confidence without manual duplication.
10.3 As Juliana, I want to change a recurring bill/income and choose whether it applies once or to all future occurrences, so my plan stays accurate when life changes.
10.4 As Juliana, I want to confirm a planned item happened and record the final real details, so my ledger matches reality and my plan stays trustworthy.
10.5 As Juliana, I want to take action on a planned item (confirm, skip, or link to an existing transaction), so my planning stays accurate without duplicate work.
10.6 As Alex, I want to link a real transaction (manual or imported) to a planned item occurrence, so the plan is completed and doesn’t appear overdue or duplicated.

## Epic 11: Planning Views (Timeline, Running Balance, What-If)

11.1 As Juliana, I want a centralized view of upcoming planned items ordered by date, so I can prioritize what’s due soon and avoid surprises.
11.2 As Juliana, I want to see upcoming planned items alongside my projected running balance, so I can spot dates where I might run out of money.
11.3 As Juliana, I want overdue planned items to be clearly highlighted at the top, so I don’t miss something that is already late.
11.4 As Alex, I want to drag/reschedule a planned bill on the timeline to simulate changes, so I can see whether shifting a payment date avoids a projected negative balance.

## Epic 12: Reminders and Notifications

12.1 As Juliana, I want to configure when I get reminders about upcoming planned expenses, so reminders match my routine.
12.2 As Juliana, I want to receive reminders before a planned expense is due, so I can pay on time and keep plan and ledger aligned.

## Epic 13: Safe to Spend, Buffers, and Confidence

13.1 As Juliana, I want to see how much I can safely spend today, so I can make small purchase decisions with confidence and avoid end-of-month stress.
13.2 As Juliana, I want to see how Prisma calculated Safe to Spend, so I trust the number and understand what is reserving my money.
13.3 As Alex, I want to understand why Safe to Spend changed since yesterday, so I can verify what inputs and events affected my spending freedom.
13.4 As Juliana, I want to see a data confidence status, so I know when Prisma’s planning and Safe to Spend outputs are reliable.
13.5 As Juliana, I want to choose which account Safe to Spend should protect and set a minimum cash buffer, so Prisma matches my real-world spending behavior and helps prevent overdraft.
13.6 As Juliana, I want to optionally keep a hidden emergency buffer out of the Safe to Spend number, so I feel safer even during uncertainty.
13.7 As Juliana, I want to know how much cash I must reserve for essentials for the month (e.g., bills and groceries), so I clearly understand what is truly safe for wants.

## Epic 14: Financial Health Summary, Alerts, and Risk Forecasting

14.1 As Juliana, I want a high-level overview of my finances immediately after login, so I can spot issues quickly without navigating menus.
14.2 As Juliana, I want a simple financial health summary, so I can tell if I’m trending stable or risky without analyzing every detail.
14.3 As Juliana, I want to be alerted when my financial health is at risk, so I can take action early.
14.4 As Juliana, I want to be warned now if I’m likely to run out of money later, so I can adjust before I overdraft.

## Epic 15: Goals, Reserves, and Progress Forecasting

15.1 As Alex, I want to define a savings objective with a target date, so I have a clear deadline and can plan contributions.
15.2 As Juliana, I want to reserve a portion of my balance for a goal without changing the account’s real balance, so Safe to Spend stays honest while goals stay protected.
15.3 As Alex, I want to track progress and see a realistic forecast of when I’ll achieve my goal based on current habits, so I can adjust behavior with confidence.

## Epic 16: Credit Cards (Brazil-Specific: Cycles, Invoices, Installments)

16.1 As Alex, I want to add a credit card with billing cycle rules and current outstanding amount, so Prisma groups purchases into correct invoices and tracks available limit.
16.2 As Juliana, I want to record an expense on a credit card, so I understand what will appear on my next invoice.
16.3 As Alex, I want to record a credit card purchase in installments (parcelado), so Prisma reflects committed debt across future invoices accurately.
16.4 As Alex, I want to view credit card charges grouped by invoice cycle, so I understand what I owe for a statement and why that total is correct.
16.5 As Juliana, I want to view my credit card’s current status (outstanding amount, available limit, invoice cycle dates), so I know what I can still spend and what invoice I’m accumulating.
16.6 As Juliana, I want to record a payment toward my credit card invoice from an asset account, so my cash decreases, my card outstanding decreases, and invoice status stays correct.
16.7 As Juliana, I want each upcoming credit card invoice to appear as a single planned item in planning views, so I can plan for the total payment without manually summing charges.
16.8 As Alex, I want to archive a credit card I no longer use while preserving history, so my active list stays clean without losing spending data.
16.9 As Alex, I want to analyze my credit card spending trends, so I can control debt usage and avoid unhealthy patterns.

## Epic 17: Liabilities, Debt Payoff, and Net Worth

17.1 As Alex, I want to track liabilities (loans, overdrafts) alongside assets, so I can see my true net worth.
17.2 As Juliana, I want to know when I will be debt-free if I keep paying minimums, so I have clarity and motivation.
17.3 As Juliana, I want to choose a payoff strategy (psychological vs mathematical), so the plan matches what I can actually stick to.
17.4 As Juliana, I want to see how much faster I can be debt-free if I pay an extra `R$ 100` per month, so I can decide if the sacrifice is worth it.
17.5 As Juliana, I want to see the impact of a one-off payment right now, so I feel motivated to use a bonus or unexpected cash wisely.

## Epic 18: Reporting, Dashboards, Charts, and Time Navigation

18.1 As Alex, I want to change the date range of my reports (e.g., Last Month, This Year), so I can analyze different periods quickly.
18.2 As Alex, I want to view my finances by month, so I can understand cashflow and budget adherence over time.
18.3 As Alex, I want a master dashboard that lets me navigate through time, so I can analyze past performance and forecast future liquidity.
18.4 As Alex, I want to zoom out to macro trends, so I can evaluate net worth growth and long-term habits.
18.5 As Alex, I want a line chart of account balance evolution, so I can visualize trends in my wealth.
18.6 As Alex, I want a projection of my future balance based on recent habits, so I can anticipate problems early or stay motivated by progress.

## Epic 19: Budgeting (Limits, Progress, Splits)

19.1 As Alex, I want to set monthly spending limits per category, so I can create guardrails for discretionary spending.
19.2 As Alex, I want to see progress against each monthly budget, so I can spot overspending early and adjust.
19.3 As Alex, I want to split a single purchase/receipt into multiple categories, so my budgets and reports stay accurate.

## Epic 20: Search and Information Architecture

20.1 As Juliana, I want to find anything in the app by typing a keyword, so I don’t have to remember where it lives in menus.
20.2 As Alex, I want a full search results page when a quick overview isn’t enough, so I can navigate directly to the exact item I need.

## Epic 21: Speed Capture (On the Go)

21.1 As Juliana, I want to log a purchase in under 5 seconds, so I can keep Prisma accurate even when I’m busy or at checkout.

## Epic 22: UI Complexity Controls (Reduce Overwhelm)

22.1 As Juliana, I want to hide complex charts and see only what matters today, so I don’t feel overwhelmed and I keep using Prisma.
22.2 As Juliana, I want a simple money to-do list for today, so I feel “done” and in control without overthinking.
22.3 As Juliana, I want the app to feel supportive rather than judgmental during tough periods, so I don’t disengage when I need it most.

## Epic 23: Data Import (Statements to Staging to Import)

23.1 As Alex, I want to upload a bank statement file (CSV or OFX), so Prisma can normalize transactions for review before importing.

## Epic 24: Data Export (Portability)

24.1 As Alex, I want to export my data to CSV, so I can analyze it externally and I’m not locked into Prisma.
