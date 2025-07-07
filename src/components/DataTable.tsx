import React, { useMemo, useState } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  type IColumn,
  SearchBox,
  Stack,
  Text,
} from "@fluentui/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface ColumnConfig {
  key: string;
  name: string;
  fieldName: string;
  minWidth?: number;
  maxWidth?: number;
  isResizable?: boolean;
  isSorted?: boolean;
  isSortedDescending?: boolean;
  onRender?: (item: any) => JSX.Element;
}

interface CustomTableProps {
  columns: ColumnConfig[];
  items: any[];
  selectionMode?: SelectionMode;
  onRowClick?: (item: any) => void;
  actions?: React.ReactNode;
  pageSize?: number;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  items,
  selectionMode = SelectionMode.none,
  onRowClick,
  actions,
  pageSize,
}) => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    if (!filterText) return items;
    const lower = filterText.toLowerCase();
    return items.filter(item =>
      columns.some(col => {
        const val = item[col.fieldName];
        return typeof val === "string" && val.toLowerCase().includes(lower);
      })
    );
  }, [filterText, items, columns]);

  const totalPages = pageSize ? Math.ceil(filteredItems.length / pageSize) : 1;

  const visibleItems = useMemo(() => {
    if (!pageSize) return filteredItems;
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handleSearch = (_: any, newValue?: string) => {
    setFilterText(newValue || "");
    setCurrentPage(1);
  };

  const handleItemInvoked = (item: any) => {
    onRowClick?.(item);
  };

  return (
    <Stack

      styles={{ root: { width: "100%", } }}
    >

      <Stack horizontal verticalAlign="center" horizontalAlign="space-between" styles={{ root: { width: "100%" } }}>
        {actions && <Stack.Item>{actions}</Stack.Item>}
        <Stack.Item grow styles={{ root: { display: "flex", justifyContent: "flex-end" } }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 220 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                color: "#666",
                pointerEvents: "none",
              }}
            />
            <SearchBox
              placeholder="Search..."
              value={filterText}
              onChange={handleSearch}
              styles={{
                root: { width: "100%" },
                icon: { display: "none" },
                field: { paddingLeft: 2 },
              }}
            />
          </div>

        </Stack.Item>
      </Stack>

      <DetailsList
        items={visibleItems}
        columns={columns as IColumn[]}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={selectionMode}
        onItemInvoked={handleItemInvoked}
        styles={{
          root: { overflowX: 'auto', width: '100%' },

          // Header styles
          headerWrapper: {
            selectors: {
              '.ms-DetailsHeader-cell': {
                background: '#f4f4f4 !important',
                color: '#005a9e',
                fontSize: '18px', 
                fontWeight: 600,
              },
            },
          },

          contentWrapper: {
            selectors: {
              '.ms-DetailsRow-cell': {
                fontSize: '15px !important',
                padding: '8px 12px',
              },
            },
          },
        }}
      />


      {pageSize && totalPages > 1 && (
        <Stack
          horizontal
          horizontalAlign="center"
          verticalAlign="center"
          tokens={{ childrenGap: 8 }}
          styles={{ root: { paddingTop: 12 } }}
        >
          <ChevronLeft
            size={20}
            style={{
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              opacity: currentPage <= 1 ? 0.3 : 1,
            }}
            onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
          />
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <ChevronRight
            size={20}
            style={{
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              opacity: currentPage >= totalPages ? 0.3 : 1,
            }}
            onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default CustomTable;
