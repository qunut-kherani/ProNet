# 🌐 ProNet — Professional Networking Platform

ProNet is a full-stack, responsive professional networking web application designed to replicate the core features and user experience of LinkedIn. It connects professionals, facilitates real-time communication, hosts a live content-sharing feed, and includes a functional career job portal.

---

## 🔍 How It Works (The User Flow)

1. **Authenticate:** A user signs up with their name and email, creating a secure account profile.
2. **Build Profile:** The user populates their professional identity by adding their headline, bio, skills, education, and work experience.
3. **Connect & Network:** Users search for colleagues or peers by name or skill and send connection requests.
4. **Engage on the Feed:** Users post updates (text and media assets) to the global chronological news feed, where network connections can like and comment in real time.
5. **Communicate:** Connected users open secure, instant chat threads to message each other privately.
6. **Advance Careers:** Users search for open roles by keywords, view job descriptions, and apply instantly.

---

## 🛠️ What is Inside (Core Feature Breakdown)

### 🔐 1. Authentication System
* **Secure Entry:** Full user onboarding through Email/Password signup and login states.
* **Session Memory:** Keeps users logged in securely across page refreshes so they never lose their spot.
* **Route Protection:** Automatically redirects unauthenticated guests back to the login screen if they try to access internal network pages.

### 🏠 2. Chronological News Feed
* **Content Creation:** A desktop and mobile-optimized post creator supporting text posts and image attachments.
* **Real-Time Activity:** A living timeline where the newest posts appear instantly at the top of the feed.
* **Social Engagement:** Responsive "Like" toggles with active counters and an expandable, real-time comment section on every post.

### 👤 3. Self-Managing User Profiles
* **Professional Dashboard:** Dedicated layout showcasing user Avatars, Headline Bio, Skills, Education, and Work Experience.
* **In-Place Editing:** Interactive components allow users to edit and save changes to their profile information directly on the page without navigating away.

### 💼 4. Job Portal & Application Engine
* **Job Board:** A clean index page displaying active corporate job listings, including titles, full descriptions, and requirements.
* **Instant Apply:** A simple form submission workflow allowing users to apply to any role with a single click.

### 🔍 5. Multi-Field Global Search
* **User Lookup:** Instant client-side filtering to search and find other professionals on the platform by their names or skills.
* **Job Lookup:** Keyword-matching search to isolate and filter career opportunities dynamically.

### 🤝 6. Connection & Network Management
* **Network Building:** Systems to send connection invitations to other users.
* **Request Pipeline:** A dedicated space to review, accept, or decline pending connection requests from peers.
* **Network Roster:** A clean list layout displaying all of a user's active, verified connections.

### 💬 7. Real-Time Messaging System
* **Live Chat Interface:** A secure, peer-to-peer chat box layout built for instant communication.
* **Zero-Refresh Updates:** Messages sync up and display on screen immediately as they are typed, without requiring a page refresh.

### 🔔 8. Centralized Notification Center
* **Live Alerts:** Instant notification badges and text dispatches that alert users when:
  * They receive a new connection request.
  * A connection likes or comments on their post.
  * A connection sends them a private chat message.

---

## 📂 Project Component Map

* `Navbar` — The global header housing the search engine, navigation tabs, and notification badges.
* `Sidebar` — A left-side quick-glance panel showing the logged-in user's profile summary and network stats.
* `Post` — The individual feed card component containing author details, post content, like buttons, and comment sections.
* `Jobs` — The centralized workspace housing active job boards and application forms.
* `Messages` — The dual-panel live chat terminal showing active conversations and message history.
* `Profile` — The editable biographical resume dashboard.
