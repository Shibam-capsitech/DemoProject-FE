import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, type IBreadcrumbItem, type IDividerAsProps } from "@fluentui/react/lib/Breadcrumb";
import { ChevronRight } from "lucide-react";
import apiService from "../../api/apiService";


const routeNameMap: { [key: string]: string } = {
  admin: "dashboard",
  clients: "Clients",
  tasks: "Tasks",
  login: "Login",
  signup: "Sign Up",
};

function CustomDivider(_: IDividerAsProps): JSX.Element {
  return (
    <span aria-hidden="true" style={{ cursor: "default", padding: "0 4px", fontSize: "18px" }}>
      <ChevronRight size="15px" />
    </span>
  );
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState<string | null>(null);

  const pathnames = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    const lastSegment = pathnames[pathnames.length - 1];
    const secondLast = pathnames[pathnames.length - 2];

    const isBusinessRoute = secondLast === "clients" || secondLast === "business";
    const isTaskRoute = secondLast === "tasks" 
    const isId = /^[a-f\d]{24}$/i.test(lastSegment); 

    if (isBusinessRoute && isId) {
      apiService.get(`/business/get-business-by-id/${lastSegment}`).then((res) => {
        setBusinessName(res.business.name || "Business");
      }).catch(() => setBusinessName("Business"));
    } else if(isTaskRoute && isId) {
     apiService.get(`/task/get-task-by-id/${lastSegment}`).then((res) => {
        setBusinessName(res.task.title || "Business");
      }).catch(() => setBusinessName("Business"));
    }
  }, [location.pathname]);

  const breadcrumbItems: IBreadcrumbItem[] = pathnames.map((segment, index) => {
    const path = "/" + pathnames.slice(0, index + 1).join("/");
    const isLast = index === pathnames.length - 1;

    let text = routeNameMap[segment] || segment;
    if (isLast && businessName) {
      text = businessName;
    }

    return {
      text,
      key: path,
      onClick: () => navigate(path),
      isCurrentItem: isLast,
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
          root: { fontSize: "0.70rem" },
          itemLink: { fontSize: "13px", lineHeight: "1.2" },
          overflow: { fontSize: "13px" },
        }}
      />
    </div>
  );
};

export default Breadcrumbs;
