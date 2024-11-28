"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Home.module.css";

export default function Home() {
  const [showOrangeBookSubLinks, setShowOrangeBookSubLinks] = useState(false);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img
            src="https://www.ai4pharma.ai/wp-content/themes/ai4pharma/assets/images/Logo.svg"
            alt="Company Logo"
            className={styles.logo}
          />
        </div>
        <nav className={styles.navLinks}>
          <Link href="/company">Companies</Link>
          <Link href="/investigators">Investigators</Link>
          <Link href="/benchmarking">Benchmarking</Link>
          <div
            className={styles.orangeBookLink}
            onClick={() =>
              setShowOrangeBookSubLinks(!showOrangeBookSubLinks)
            }
          >
            Orange Book
          </div>
          {showOrangeBookSubLinks && (
            <div className={styles.subLinks}>
              <Link href="/orangebook/products">Products</Link>
              <Link href="/orangebook/patents">Patents</Link>
              <Link href="/orangebook/exclusivity">Exclusivity</Link>
            </div>
          )}
          {/* <Link href="/subsystem">Sub Systems</Link> */}
          <Link href="/inspectiondetails">Inspection Details</Link>
          <Link href="/inspectioncitations">Inspection Citations</Link>
          <Link href="/form483">Form 483</Link>
          <Link href='/warningletters'>Warning Letters</Link>
        </nav>
      </aside>
      <main className={styles.content}>
        <h1>Welcome to AI4Pharma Dashboard</h1>
        <p>Select a section from the sidebar to get started.</p>
      </main>
    </div>
  );
}
