# IEEE CIS UNI - Official Chapter Website

![IEEE CIS UNI Logo](https://erlvccwqqntypqkkrsvw.supabase.co/storage/v1/object/public/assets/Header%20Principal.png)

Welcome to the official repository of the **IEEE Computational Intelligence Society (CIS) Student Chapter** at the **Universidad Nacional de Ingeniería (UNI)**. This project is a modern, high-performance web application designed to showcase the chapter's projects, members, events, and insights.

---

## Project Overview

This platform serves as the digital hub for the IEEE CIS UNI community. It has been built with a focus on professional aesthetics, security, and scalability, featuring a cutting-edge tech stack and an optimized user experience.

### Key Features

- **Premium Dark UI**: A bespoke design system built with Vanilla CSS and Tailwind, featuring glassmorphism, smooth gradients, and a tech-centric aesthetic.
- **Fully Responsive**: Optimized for all devices, from mobile phones to high-resolution desktops.
- **Dynamic Content Management**:
  - **Blog System**: Full support for SEO-friendly slugs and dynamic routing.
  - **Project Portfolio**: Showcasing chapter innovations with dedicated detail pages.
- **Secure Architecture**:
  - Full environment variable integration for all sensitive data (Supabase keys, SMTP credentials).
  - Robust `.gitignore` configuration for public repository safety.
- **Institutional Contact System**:
  - Secure Server Actions implementation using **Nodemailer**.
  - Custom HTML email templates (Dark Mode) for both admin notifications and user confirmations.
- **Performance Optimized**: Built with Next.js 16+ for lightning-fast load times and efficient rendering.
- **Computational Intelligence Aesthetic**: Custom tech-themed placeholders and high-fidelity favicon.

---

## Technical Stack

- **Framework**: [Next.js 16+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend Logic**: Next.js Server Actions
- **Email Service**: [Nodemailer](https://nodemailer.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Fonts**: [Poppins (Google Fonts)](https://fonts.google.com/specimen/Poppins)

---

## Directory Structure

```text
src/
├── app/              # Next.js App Router (Routes and Server Actions)
│   ├── actions/      # Server-side logic (Email, Database mutations)
│   ├── blog/         # Dynamic Blog routes [slug]
│   ├── proyectos/    # Dynamic Project routes [slug]
│   └── ...           # Main pages (Home, About, Contact, etc.)
├── components/       # Reusable UI components
│   ├── home/         # Section-specific components
│   └── ui/           # Atomic UI elements (Buttons, Cards, etc.)
├── lib/              # Third-party configurations (Supabase client)
├── types/            # TypeScript definitions and Database schemas
└── ...
```

---

## Environment Variables Setup

To run this project locally or deploy it to production, you must configure the following variables in your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email (SMTP) Configuration
SMTP_EMAIL=your_institutional_email
SMTP_PASSWORD=your_app_specific_password
CONTACT_RECIPIENT=destination_email_for_messages

# Email Assets & Social Links
EMAIL_HEADER_IMAGE_URL=url_to_email_banner
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/ieee-cis-uni
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/ieeecisuni
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/ieeecisuni
```

---

## Installation & Development.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SebasHuaypar/ieee-cis-uni-website.git
   cd ieee-cis-uni-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Contributing

We welcome contributions! If you're a member of the chapter or an open-source enthusiast, feel free to:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Contact & Support

**IEEE CIS UNI Student Chapter**  
Universidad Nacional de Ingeniería, Lima, Perú  
[ieee.cis@uni.edu.pe](mailto:ieee.cis@uni.edu.pe)  
[Official Website](https://ieeecisuni.vercel.app)

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
## Author

<div align="center">

### Sebastián Huaypar Acurio

Computer Science Student @ UNI  
AI, Data Science & Analytics Engineering Enthusiast Making websites just for fun  
[LinkedIn](https://www.linkedin.com/in/sebashuaypar)

</div>
