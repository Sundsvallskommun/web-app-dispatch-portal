import React, { ReactNode, useRef } from 'react';
import Head from 'next/head';

interface DefaultLayoutProps {
  title: string;
  pageheader?: React.JSX.Element;
  children: ReactNode;
  headerMenu?: React.JSX.Element;
}

const DefaultLayout = ({ title, pageheader, children, headerMenu }: DefaultLayoutProps) => {
  const initialFocus = useRef<HTMLElement>(null);

  return (
    <div className="DefaultLayout full-page-layout bg-background-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Head>
      {headerMenu}
      <main className="main-wrapper focus:outline-none" ref={initialFocus} tabIndex={-1}>
        {pageheader && pageheader}
        <div className="main-container flex-grow">
          <div className="container">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
