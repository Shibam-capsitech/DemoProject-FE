import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, type IBreadcrumbItem, type IDividerAsProps } from "@fluentui/react/lib/Breadcrumb";
import { ChevronRight } from "lucide-react";

const routeNameMap: { [key: string]: string } = {
  admin: "Home",
  clients: "Clients",
  tasks: "Tasks",
  login: "Login",
  signup: "Sign Up",
};

function CustomDivider(dividerProps: IDividerAsProps): JSX.Element {
  return (
    <span
      aria-hidden="true"
      style={{ cursor: "default", padding: "0 4px", fontSize: "18px" }}
    >
      <ChevronRight size="18px"/>
    </span>
  );
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems: IBreadcrumbItem[] = pathnames.map((segment, index) => {
    const path = "/" + pathnames.slice(0, index + 1).join("/");
    return {
      text: routeNameMap[segment] || segment,
      key: path,
      onClick: () => navigate(path),
      isCurrentItem: index === pathnames.length - 1,
    };
  });

  return (
    <div style={{ padding: "3px 0" }}>
      <Breadcrumb
        items={breadcrumbItems}
        maxDisplayedItems={5}
        ariaLabel="Breadcrumb"
        overflowAriaLabel="More links"
        dividerAs={CustomDivider}
        styles={{
          root: { fontSize: "0.75rem" },
          itemLink: { fontSize: "18px", lineHeight: "1.2" },
          overflow: { fontSize: "18px" },
        }}
      />
    </div>
  );
};

export default Breadcrumbs;
