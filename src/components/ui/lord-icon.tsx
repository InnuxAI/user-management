"use client";

import React, { useEffect, useRef } from 'react';

// Define lordicon types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': {
        src?: string;
        trigger?: string;
        colors?: string;
        style?: React.CSSProperties;
        className?: string;
        state?: string;
        delay?: string;
        'data-lord-icon'?: string;
        ref?: React.Ref<HTMLElement>;
      };
    }
  }
}

// Extend HTMLElement for lord-icon
interface LordIconElement extends HTMLElement {
  src?: string;
  trigger?: string;
  colors?: string;
  state?: string;
  delay?: string;
}

interface LordIconProps {
  src: string;
  trigger?: 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'morph-two-way';
  colors?: string;
  style?: React.CSSProperties;
  className?: string;
  state?: string;
  delay?: string;
  size?: number;
}

export const LordIcon: React.FC<LordIconProps> = ({
  src,
  trigger = 'hover',
  colors,
  style,
  className,
  state,
  delay,
  size = 24,
}) => {
  const iconRef = useRef<LordIconElement>(null);

  useEffect(() => {
    // Load lordicon script if not already loaded
    if (!window.customElements?.get('lord-icon')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.lordicon.com/lordicon.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const iconStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    ...style,
  };

  return React.createElement('lord-icon', {
    ref: iconRef,
    src,
    trigger,
    colors,
    style: iconStyle,
    className,
    state,
    delay,
  });
};

// Predefined icon URLs for common use cases
export const LORDICON_URLS = {
  // Business & Company
  company: "https://cdn.lordicon.com/msoeawqm.json", // Building/Company
  office: "https://cdn.lordicon.com/cnpvyndp.json", // Office building

  // Documents & Files
  document: "https://cdn.lordicon.com/nocovwne.json", // Document/File
  documents: "https://cdn.lordicon.com/jjoolpwc.json", // Multiple documents
  pdf: "https://cdn.lordicon.com/ogbpthqd.json", // PDF file

  // Charts & Analytics
  chart: "https://cdn.lordicon.com/qhgmphtg.json", // Chart/Analytics
  analytics: "https://cdn.lordicon.com/rjzlnunf.json", // Analytics dashboard
  report: "https://cdn.lordicon.com/gqzfzudq.json", // Report

  // User & People
  user: "https://cdn.lordicon.com/bhfjfgqf.json", // User profile
  users: "https://cdn.lordicon.com/dxjqoygy.json", // Multiple users

  // Actions
  search: "https://cdn.lordicon.com/xfftupfv.json", // Search
  filter: "https://cdn.lordicon.com/puvaffet.json", // Filter
  download: "https://cdn.lordicon.com/lyrrgrsl.json", // Download
  upload: "https://cdn.lordicon.com/nxaaasqd.json", // Upload

  // Navigation
  home: "https://cdn.lordicon.com/cnpvyndp.json", // Home
  dashboard: "https://cdn.lordicon.com/qjfoidnh.json", // Dashboard
  settings: "https://cdn.lordicon.com/drxwpavl.json", // Settings

  // Status & Indicators
  success: "https://cdn.lordicon.com/oqdmuxru.json", // Success/Check
  error: "https://cdn.lordicon.com/akqsdstj.json", // Error/Warning
  loading: "https://cdn.lordicon.com/msoeawqm.json", // Loading spinner

  // Tools & Actions
  edit: "https://cdn.lordicon.com/wuvorxbv.json", // Edit/Pencil
  delete: "https://cdn.lordicon.com/wpyrrmcq.json", // Delete/Trash
  add: "https://cdn.lordicon.com/zrkkrrpl.json", // Add/Plus

  // Communication
  notification: "https://cdn.lordicon.com/lznlxwtc.json", // Bell/Notification
  email: "https://cdn.lordicon.com/ozlkyfxg.json", // Email

  // Business specific
  vendor: "https://cdn.lordicon.com/uomkwtjh.json", // Vendor/Building
  rfq: "https://cdn.lordicon.com/nocovwne.json", // RFQ document
  project: "https://cdn.lordicon.com/jjoolpwc.json", // Project folder
};
