import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_METADATA = {
  '/': {
    title: 'Raji Al-Abdullah | Full-Stack Software Engineer',
    description: 'Explore modern full-stack MERN web applications, REST APIs, and responsive interactive interfaces engineered by Raji Al-Abdullah.',
  },
  '/about': {
    title: 'About & Technical Skills | Raji Al-Abdullah',
    description: 'Learn more about my development workflow, architecture standards, and database-synced technical skill milestones.',
  },
  '/portfolio': {
    title: 'Featured Projects & Engineering Milestones | Raji Al-Abdullah',
    description: 'Interactive showcase of full-stack engineering milestones across React 19, Node.js, algorithms, and cloud APIs.',
  },
  '/contact': {
    title: 'Get In Touch | Raji Al-Abdullah',
    description: 'Send a direct message regarding full-stack software development projects, technical collaboration, or career roles.',
  },
  '/login': {
    title: 'Admin Portal Login | Portfolio Hub',
    description: 'Authorized administrative authentication checkpoint.',
  },
  '/admin': {
    title: 'Portfolio Control Center | Dashboard',
    description: 'Manage live project milestones, drafts, and client contact inbox.',
  },
};

const PageSEO = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = PAGE_METADATA[pathname] || PAGE_METADATA['/'];

    // Update document title
    document.title = meta.title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', meta.description);

    // Update Open Graph tags dynamically
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://raji-dev.nl${pathname}`);
  }, [pathname]);

  return null;
};

export default PageSEO;