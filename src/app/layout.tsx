import type { Metadata } from "next";
import { geist, inter, jetbrains, instrumentSerif } from "@/lib/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Preetham Dandu — Software · Backend · AI · ML Engineer",
  description: "Software engineer building backend systems, AI agents, and ML infrastructure. M.S. Computer Science, Stony Brook. Published research on safety-validated clinical AI.",
  openGraph: {
    title: "Preetham Dandu — Software · Backend · AI · ML Engineer",
    description: "Software engineer building backend systems, AI agents, and ML infrastructure.",
    images: ["/og/home.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.variable} ${jetbrains.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Preetham Dandu",
              jobTitle: "Software Engineer · Backend Engineer · AI Engineer · ML Engineer",
              alumniOf: { "@type": "CollegeOrUniversity", "name": "Stony Brook University" },
              knowsAbout: ["Python", "Go", "TypeScript", "PyTorch", "Kubernetes", "gRPC", "Kafka", "LLM Agents", "RAG", "Feature Fusion"]
            })
          }}
        />
      </head>
      <body className="antialiased">
        {/* We will wrap this in LenisProvider and add Navbar, Cursor in Phase 2 */}
        {children}
      </body>
    </html>
  );
}
