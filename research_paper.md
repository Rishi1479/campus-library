
# Design and Development of a Cloud-Native Campus Library Management System Using the MERN Stack

**Author:** K. Sai Rishwanth Reddy
**Department:** Computer Science and Engineering
**Institution:** [Your Institution Name]
**Email:** [Your Email]

---

## Abstract

Library management in academic institutions has historically depended on manual, paper-based workflows that are inefficient, error-prone, and difficult to scale. This paper presents the design, development, and cloud deployment of a **Campus Library Management System (CLMS)** built using the MERN stack — MongoDB, Express.js, React.js, and Node.js. The system digitizes the complete library operation cycle, including book inventory management, student-facing cataloguing, book issuance and return, automated fine calculation, and a student grievance ticketing module. A dual-role architecture is enforced through JWT-based stateless authentication and role-based access control (RBAC) middleware. Cloudinary is integrated for persistent cloud image storage, solving the ephemeral filesystem problem common in cloud-hosted deployments. The system is deployed at zero cost on Render (backend), Vercel (frontend), and MongoDB Atlas (database), making it immediately viable for institutions of any size. Results demonstrate a fully functional production system with end-to-end automation of library workflows. Future work includes mobile application development, online fine payment integration, and an AI-based book recommendation engine.

**Keywords:** Library Management System, MERN Stack, JWT Authentication, RBAC, Cloudinary, REST API, MongoDB, Cloud Deployment, Academic Library Automation.

---

## I. Introduction

Academic libraries form the intellectual infrastructure of any educational institution. They house thousands of books, journals, and reference materials that are critical to student learning and faculty research. Despite this importance, the internal management of campus libraries — particularly at mid-sized colleges and universities — continues to rely on outdated manual processes. Physical registers, index cards, and handwritten records remain common tools for tracking book availability, recording borrowing transactions, and calculating overdue fines. These methods introduce a range of operational challenges: records are frequently lost or damaged, availability information is inaccessible without physical presence, fine calculations are inconsistent, and there is no formal mechanism for student-administrator communication regarding library issues.

The proliferation of web technologies and cloud computing infrastructure over the past decade has made it feasible to replace these manual workflows with robust, automated digital systems at low or zero cost. The MERN stack — a combination of MongoDB, Express.js, React.js, and Node.js — has emerged as a leading full-stack JavaScript framework for building such systems, offering a unified development environment, a large ecosystem of open-source packages, and excellent compatibility with cloud deployment platforms.

This paper presents the **Campus Library Management System (CLMS)**, a full-stack web application developed to address the limitations of traditional library management in academic settings. The system automates book inventory management, issuance workflows, return processing, and fine calculation, while introducing two novel features rarely found in campus-scale systems: a **Cloudinary-integrated image persistence layer** and an **IssueTracker grievance management module**. The system is deployed to a live production environment using industry-standard cloud platforms at zero cost, demonstrating a highly accessible and reproducible deployment model for academic institutions.

The remainder of this paper is organized as follows: Section II reviews related work; Section III presents the system architecture; Section IV describes the implementation; Section V discusses results; and Section VI concludes with future work.

---

## II. Literature Review

The computerization of library management has been a subject of ongoing research and development since the 1980s. Early systems such as OPAC (Online Public Access Catalogue) and MARC (Machine-Readable Cataloging) introduced digital cataloguing that significantly reduced manual effort in large libraries [1]. However, these systems were standalone, on-premises applications with limited networking capability, requiring expensive proprietary licenses and dedicated IT infrastructure.

The 2000s saw a shift toward web-based Integrated Library Systems (ILS). Breeding (2007) documented the growing adoption of networked library systems that enabled simultaneous multi-user access to catalogues [2]. Open-source platforms such as Koha and OpenBiblio emerged as cost-effective alternatives to proprietary systems, offering modules for cataloguing, circulation, and OPAC. However, Chowdhury and Chowdhury (2003) noted that these platforms, while comprehensive, carried steep deployment and customization learning curves that made them inaccessible to smaller institutions [3].

The introduction of cloud computing brought significant improvements in accessibility and scalability. Aharony (2014) studied the adoption of cloud-based library services and concluded that cloud infrastructure substantially lowered operational costs and improved availability for academic libraries [4]. Concurrently, Fielding's seminal work on Representational State Transfer (REST) architecture established the API design principles that modern decoupled web applications now follow [5].

In the domain of database technology, Han et al. (2011) conducted a comparative analysis of SQL and NoSQL databases, concluding that document-oriented databases like MongoDB are particularly suited for applications with flexible, evolving data structures — a characteristic well-aligned with library management systems [6]. The rise of React.js for building component-based single-page applications, documented extensively in industry surveys (Stack Overflow Developer Survey, 2022–2023), further validated the MERN stack as an appropriate technology choice for dynamic, data-driven dashboards.

Security in web-based library systems has also received attention. Jones et al. (2015) demonstrated that JWT-based authentication, standardized under RFC 7519, provides a scalable, stateless alternative to session-based authentication suited for RESTful APIs [7]. Ferraiolo and Kuhn's foundational work on Role-Based Access Control (RBAC) established the access management model applied in this system to enforce dual-role privilege separation [8].

Despite the body of existing work, a gap remains for lightweight, zero-cost, cloud-native library systems that integrate modern image storage, student grievance management, and automated fine calculation in a single deployable package tailored for campus-scale academic institutions — a gap this project addresses directly.

---

## III. System Architecture

### A. Three-Tier Architecture

The CLMS follows a classic three-tier client-server architecture, separating concerns across three distinct layers:

1. **Presentation Layer (Frontend):** A React.js single-page application bootstrapped with Vite, deployed on Vercel. Provides separate dashboards for students and administrators, consuming backend APIs via HTTP requests.

2. **Application Logic Layer (Backend):** A Node.js/Express.js RESTful API server hosted on Render, handling all business logic — authentication, book management, issuance workflows, fine calculation, and grievance management.

3. **Data Layer:** MongoDB Atlas (cloud-hosted NoSQL database) for persistent application data, accessed via the Mongoose ODM. Cloudinary serves as a specialized media storage layer for book cover images.

### B. Database Schema Design

The system defines five Mongoose schemas forming the data backbone:

| Collection | Key Fields |
|---|---|
| **User** | name, email, password (hashed), role (student/admin), studentId, department, isApproved |
| **Book** | title, author, ISBN (unique), category, totalCopies, availableCopies, coverImage (Cloudinary URL) |
| **IssueRecord** | book (ref), student (ref), issueDate, dueDate, returnDate, status (requested/issued/returned/overdue), fine |
| **IssueTracker** | student (ref), type, description, status (open/in_progress/resolved), priority, adminReply |
| **Fine** | student (ref), issueRecord (ref), amount, status (paid/unpaid), paymentDate |

Cross-collection references are implemented via MongoDB ObjectId with Mongoose populate(), enabling efficient JOIN-like queries without data duplication.

### C. API Design

The backend exposes five RESTful API route groups:

| Route Prefix | Purpose |
|---|---|
| `/api/auth` | Registration, login, JWT token issuance |
| `/api/books` | Book CRUD, Cloudinary image upload |
| `/api/issues` | Book request, approval, return, fine calculation |
| `/api/tracker` | IssueTracker grievance management |
| `/api/admin` | Admin dashboard, student management |

All routes follow standard HTTP semantics (GET, POST, PUT, DELETE) and return JSON responses with appropriate HTTP status codes.

### D. Security Architecture

Security is enforced at two middleware layers:
- **`protect` middleware:** Extracts and verifies the JWT from the Authorization header using the server-side `JWT_SECRET`. Attaches the decoded user object to `req.user` for downstream controllers.
- **`admin` middleware:** Checks `req.user.role === 'admin'`, returning HTTP 403 for unauthorized access attempts. Both middleware functions are composed in series on protected administrative routes.

---

## IV. Implementation

### A. Backend Development

The backend is developed in Node.js using Express.js v5, following the MVC (Model-View-Controller) pattern. The server entry point (`server.js`) initializes Express, configures CORS with production frontend URLs whitelisted, mounts all route modules, and establishes the MongoDB Atlas connection via Mongoose. Key dependencies include:

- **bcryptjs** (v3.0.3): Password hashing with salt factor 10, applied via a Mongoose `pre('save')` hook.
- **jsonwebtoken** (v9.0.3): JWT generation on login and verification on every protected request.
- **multer + multer-storage-cloudinary**: File upload middleware that streams images directly to Cloudinary, returning a persistent public URL stored in the Book document.
- **nodemailer** (v8.0.5): Email notification foundation for future enhancement.

Controllers implement `async/await` patterns with `try/catch` blocks, returning standardized JSON error responses with appropriate HTTP status codes.

### B. Book Issuance and Fine Calculation Logic

The issuance lifecycle is managed through atomic state transitions in the `IssueRecord` collection. When a student submits a book request (`POST /api/issues/request`), a new IssueRecord is created with `status: 'requested'`. Upon admin approval (`PUT /api/issues/:id/approve`), the status transitions to `'issued'`, the `issueDate` is set to the current timestamp, and the `dueDate` is automatically calculated as 14 days from approval. The book's `availableCopies` is decremented at this point.

Fine calculation is executed during return processing (`PUT /api/issues/:id/return`):

```javascript
const returnDate = new Date();
if (returnDate > issueRecord.dueDate) {
  const diffTime = Math.abs(returnDate - issueRecord.dueDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  fineAmount = diffDays * 1; // ₹1 per overdue day
}
```

This computation is deterministic and fully automated, requiring no manual input from the administrator.

### C. Cloudinary Integration

Book cover images are uploaded via a Multer middleware pipeline configured with CloudinaryStorage:

```javascript
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus-library',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage });
```

The Cloudinary SDK is initialized from environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), ensuring no credentials are exposed in the codebase. Cloudinary returns a persistent CDN-hosted URL that is stored in the `coverImage` field of the Book document — eliminating all dependency on the server's local ephemeral filesystem.

### D. Frontend Development

The frontend is built with React.js (Vite), implementing separate dashboards for students and administrators. The student dashboard provides book browsing with real-time availability status, request submission, borrowing history, and fine tracking. The admin dashboard provides full book inventory management (add/edit/delete with image upload), student approval management, issue request processing (approve/reject), return recording, and IssueTracker grievance management with reply capability. API communication is handled via the browser's native `fetch` API, with JWT tokens stored in `localStorage` and attached to all authenticated requests via the `Authorization: Bearer` header.

---

## V. Results and Discussion

The Campus Library Management System was successfully developed, tested, and deployed to a live production environment. The following outcomes were achieved:

**Functional Completeness:** All six core modules — authentication, book management, issuance, return, fine calculation, and grievance management — were implemented and verified through end-to-end testing across both student and admin roles.

**Security Verification:** JWT-based authentication and RBAC middleware were validated by confirming that admin-only routes return HTTP 403 when accessed with a student token, and HTTP 401 when accessed without a token.

**Image Persistence:** Cloudinary integration was verified by confirming that book cover images remained accessible after multiple server restarts and redeployments on Render — a critical test that local filesystem storage fails.

**Automated Fine Accuracy:** Fine calculation was verified against multiple test cases with known overdue periods, confirming that the computed fine amount exactly matched the expected ₹1/day formula.

**Comparative Advantage:** The table below summarizes how the CLMS compares to typical campus-level library systems:

| Feature | CLMS (This Project) | Typical Campus LMS |
|---|---|---|
| Cloud image storage | ✅ Cloudinary | ❌ Rarely |
| Admin student approval | ✅ Yes | ❌ No |
| Grievance/IssueTracker | ✅ Yes | ❌ No |
| JWT + RBAC middleware | ✅ Yes | ⚠️ Partial |
| Automated fine calc | ✅ Yes | ⚠️ Sometimes |
| Zero-cost cloud deployment | ✅ Yes | ❌ Usually costly |
| Real-time copy tracking | ✅ Yes | ⚠️ Manual |

**Deployment:** The system operates continuously on its live production URLs with no recurring infrastructure cost, confirming the viability of the zero-cost cloud deployment model.

---

## VI. Conclusion and Future Work

This paper presented the design, implementation, and deployment of the Campus Library Management System — a MERN stack-based web application that fully automates the operational workflows of an academic campus library. The system successfully addresses the inefficiencies of traditional library management through a cloud-native, modular architecture that delivers secure role-based access, automated fine calculation, real-time inventory management, persistent cloud image storage, and a built-in student grievance system.

The zero-cost deployment model — built entirely on open-source technologies and free-tier cloud services — makes this system practically adoptable by academic institutions regardless of their IT budget, distinguishing it from both expensive proprietary solutions and complex open-source alternatives like Koha.

Future directions for this work include:
1. **Mobile Application** — React Native cross-platform app with push notifications via Firebase.
2. **Email/SMS Notifications** — Automated alerts for due dates, approvals, and fine reminders.
3. **Online Fine Payment** — Razorpay or Stripe payment gateway integration.
4. **Analytics Dashboard** — Visual reports on borrowing trends and fine collections using Chart.js.
5. **QR Code Book Tracking** — Physical book scanning for faster issuance and return processing.
6. **AI Recommendation Engine** — Personalized book suggestions based on borrowing history.

---

## References

[1] Library of Congress, "Understanding MARC Bibliographic: Machine-Readable Cataloging," 3rd ed., 1998.

[2] M. Breeding, "Introduction to Open Source Integrated Library Systems," *Library Technology Reports*, vol. 43, no. 2, pp. 5–11, 2007.

[3] G. G. Chowdhury and S. Chowdhury, *Introduction to Digital Libraries*. London: Facet Publishing, 2003.

[4] N. Aharony, "Librarians' Attitudes Toward Cloud Computing," *College and Research Libraries*, vol. 75, no. 2, pp. 217–231, 2014.

[5] R. T. Fielding, "Architectural Styles and the Design of Network-Based Software Architectures," Ph.D. dissertation, Univ. of California, Irvine, 2000.

[6] J. Han, E. Haihong, G. Le, and J. Du, "Survey on NoSQL Database," in *Proc. 6th Int. Conf. Pervasive Computing and Applications*, 2011, pp. 363–366.

[7] M. Jones, J. Bradley, and N. Sakimura, "JSON Web Token (JWT)," IETF RFC 7519, May 2015.

[8] D. F. Ferraiolo and D. R. Kuhn, "Role-Based Access Controls," in *Proc. 15th NIST-NCSC National Computer Security Conf.*, 1992, pp. 554–563.

[9] Stack Overflow, "Developer Survey 2023," Stack Overflow, 2023. [Online]. Available: https://survey.stackoverflow.co/2023

[10] Cloudinary, "Cloudinary Documentation — Node.js SDK," 2023. [Online]. Available: https://cloudinary.com/documentation/node_integration

---
*© 2025 K. Sai Rishwanth Reddy. All Rights Reserved.*
