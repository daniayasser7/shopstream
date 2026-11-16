import { Container } from "react-bootstrap";

const FOOTER_ITEMS = [
  "Privacy Policy",
  "Terms of Service",
  "Contact Us",
  "Shipping Info",
];

function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="ss-footer py-4">
      <Container
        fluid="xxl"
        className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
      >
        <div>
          <div className="ss-brand fs-5">ShopStream</div>
          <small>© {year} ShopStream Inc. All rights reserved.</small>
        </div>

        <ul className="list-unstyled d-flex flex-wrap gap-3 gap-md-4 mb-0">
          {FOOTER_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}

export default AppFooter;