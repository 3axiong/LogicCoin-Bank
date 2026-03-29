import React from "react";

export default function ASUShell({ children }) {
  return (
    <div className="asu-shell">
      <div className="asu-topbar">
        <div className="asu-topbar-links">
          <a href="https://www.asu.edu">ASU Home</a>
          <a href="https://my.asu.edu">My ASU</a>
          <a href="https://asu.edu/academics/colleges-schools">Colleges and Schools</a>
          <a href="https://weblogin.asu.edu/cas/login">Sign In</a>
        </div>
      </div>

      <header className="asu-site-header">
        <a
          className="asu-logo-link"
          href="https://www.asu.edu"
          title="ASU homepage"
        >
          <img src="/asu_logo.png" alt="ASU logo" className="asu-header-logo" />
        </a>

        <div className="asu-site-title-wrap">
          <div className="asu-site-title">LogicCoin Bank</div>
          <div className="asu-site-subtitle">Arizona State University</div>
        </div>
      </header>

      <main className="asu-main-content">{children}</main>

      <footer className="asu-footer">
        <div className="asu-footer-top">
          <a href="https://asu.edu/about/locations-maps">Maps and Locations</a>
          <a href="https://cfo.asu.edu/applicant">Jobs</a>
          <a href="https://isearch.asu.edu/asu-people/">Directory</a>
          <a href="https://www.asu.edu/about/contact">Contact ASU</a>
          <a href="https://my.asu.edu/">My ASU</a>
        </div>

        <div className="asu-footer-bottom">
          <a href="https://www.asu.edu/about/copyright-trademark/">Copyright and Trademark</a>
          <a href="https://accessibility.asu.edu/report">Accessibility</a>
          <a href="https://www.asu.edu/about/privacy/">Privacy</a>
          <a href="https://www.asu.edu/about/terms-of-use/">Terms of Use</a>
          <a href="https://cfo.asu.edu/emergency">Emergency</a>
        </div>
      </footer>
    </div>
  );
}