# 🤝 Contributing to NeoNest

Thank you for your interest in contributing to *NeoNest* – your time and effort mean a lot to us! 💜 Whether you're reporting a bug, suggesting an enhancement, or writing your first pull request – you're welcome here. Let’s build a supportive space for contributors of all experience levels. 🚀

---

## 📌 Table of Contents

- [📋 How to Contribute](#-how-to-contribute)
- [🧠 Code Style Guidelines](#-code-style-guidelines)
- [📁 File Naming Conventions](#-file-naming-conventions)
- [✅ PR Review Process](#-pr-review-process)
- [💬 Community & Communication](#-community--communication)
- [📝 Contribution Rules](#-contribution-rules)
- [🎯 Points & Difficulty Levels](#-points--difficulty-levels)
- [🛡 Code of Conduct](#-code-of-conduct)

---

## 📋 How to Contribute

### 🐞 Bug Reports

- Open a new issue using the **bug** label.
- Include a **clear title**, a **concise description**, and the **file name/line number** if possible.
- Mention **expected behavior vs actual behavior**.
- Provide **steps to reproduce the issue**.
- Add **screenshots or screen recordings** to help us understand better.

### 🌟 Feature Requests / Docs Improvements

- Open a new issue using the **feature** or **docs** label.
- Describe what you’re proposing and **why it matters**.
- Include **UI mockups**, **screenshots**, or **API flow diagrams**, if applicable.
- Keep ideas beginner-friendly and scalable.

### 🧑‍💻 Code Contributions (Pull Requests)

Here’s a quick overview of the contribution flow:

#### 🔁 Contribution Workflow

1. **Star** and **Fork** the repo.

2. **Clone your fork**:
 ```bash
 git clone https://github.com/AditiGupta-tech/NeoNest.git
 ```

3. **Install dependencies**:
 ```bash
 npm install --legacy-peer-deps
 ```

4. **Create a new branch:**
 ```bash
 git checkout -b yourname/feature-name
 ```

5. **Make your changes:**
 * Stick to the project structure.
 * Use helpful commit messages, eg:
 * `fix: corrected typo in LandingPage.jsx`
 * `feat: added baby sleep graph comparison`

6. **Format your code:**
 ```bash
 npm run lint
 ```

7. **Update `pnpm-lock.yaml` file using this command and push along with other commits:**
 ```bash/cmd
 pnpm install
 ```

8. **Test everything!** (Manual/automated if applicable)

9. **Push your branch:**
 ```bash
 git push origin yourname/feature-name
 ```

10. **Open a Pull Request (PR) from your fork:**
 * Reference related issue(s): `Fixes #<issue-number>`
 * Add a clear title and summary.

---

## 🧠 Code Style Guidelines

To ensure consistency and maintainability, please adhere to these guidelines:

* Use **camelCase** for variables and function names.
* Component files should be **PascalCase**: `SleepTracker.jsx`.
* Run `npm run lint` to follow our ESLint + Prettier rules.
* Keep functions modular and reusable.
* Use descriptive variable names (`sleepDuration` > `temp123`).
* Avoid hardcoded values – use constants/configs where possible.

---

## 📁 File Naming Conventions

* **🧩 React Components:** PascalCase (`BabyStats.jsx`)
* **📂 Folders:** kebab-case (`/baby-data`, `/user-profile`)
* **🖼 Images/GIFs:** kebab-case and descriptive (`baby-growth-graph.gif`)
* **📄 Markdown/Docs:** kebab-case (`getting-started.md`, `api-reference.md`)

---

## ✅ PR Review Process

We aim to keep things smooth and transparent:

* Once your PR is submitted, a maintainer will review it.
* You may be asked to:
 * Fix styling issues.
 * Add missing documentation/tests.
 * Break large PRs into smaller pieces.
* After approval:
 * Your PR will be merged with a squash merge to keep history clean.
 * Points will be awarded if part of GSSoC.
 * You’ll receive feedback, even if the PR isn’t merged immediately.
* ⌛ Reviews may take **24–72 hours** depending on activity. Thanks for your patience!

---

## 💬 Community & Communication

We’re friendly and open – come say hi! 👋

Whether you’re stuck or want to share an idea, reach out through:

* 💬 [GitHub Discussions](https://github.com/AditiGupta-tech/neonest/discussions)

🧑‍🏫 Mentorship & pairing sessions are available – just ask!

---

## 📝 Contribution Rules

To ensure a smooth and fair contribution process:

* Always **Star and Fork** before contributing.
* Browse [open issues](https://github.com/AditiGupta-tech/neonest/issues) and comment to get assigned.
* **One PR per issue** – stay focused and scoped.
* **Don’t start work on an issue unless you’re assigned.**
* If you raised an issue, you’ll be assigned by default.
* Avoid making "drive-by PRs" or unrelated fixes — they’ll be closed.

---

## 🎯 Points & Difficulty Levels

Your contributions earn points that count toward GSSoC'25 and your NeoNest Leaderboard status!

| Difficulty | Points |
| :--------- | :----- |
| Level 1 | 3 |
| Level 2 | 7 |
| Level 3 | 10 |

---

## 🛡 Code of Conduct

To maintain a respectful and inclusive environment for all, we follow a Code of Conduct for all contributors and community interactions.

[Code of Conduct](CODE_OF_CONDUCT.md)


---

## 📜 License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](https://github.com/AditiGupta-tech/neonest/blob/main/LICENSE).

This helps ensure that all contributions are open, consistent, and usable for the community.

## ✨ New Here? Start with These!

* 🐣 Check out our [Good First Issues](https://github.com/AditiGupta-tech/neonest/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22good%20first%20issue%22) to begin your journey.
* You can also read our [Getting Started Guide](https://github.com/AditiGupta-tech/neonest/blob/main/README.md) to set up the project locally.

Let’s make NeoNest the go-to guide for new parents, together! 🌱

We’re excited to see what you’ll build.
