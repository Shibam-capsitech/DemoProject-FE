import React, { useMemo, useState } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  type IColumn,
  SearchBox,
  Stack,
  Text,
  Dropdown,
  type IDropdownOption,
  type IDropdownStyles,
  mergeStyleSets,
  FontWeights,
} from "@fluentui/react";
import { ChevronLeft, ChevronRight, Inbox, ListFilterPlus, Search } from "lucide-react";
import {
  FocusTrapCallout,
  FocusZone,
  FocusZoneTabbableElements,
} from "@fluentui/react";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import { useBoolean, useId } from "@fluentui/react-hooks";
import apiService from "../api/apiService";
import { useLocation } from "react-router-dom";

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
  filterCriteria?: IDropdownOption[];
  filterValue?: Record<string, IDropdownOption[]>;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  items,
  selectionMode = SelectionMode.none,
  onRowClick,
  actions,
  pageSize,
  filterCriteria,
  filterValue,
}) => {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
  const buttonId = useId("callout-button");
  const [selectedCriteria, setSelectedCriteria] = useState<string>();
  const [selectedValue, setSelectedValue] = useState<string>();
  const [filteredTableData, setFilteredTableData] = useState<any[] | null>(null);

  const location = useLocation();
  const isClientActive = location.pathname.includes("client");
  const isTaskActive = location.pathname.includes("task");

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: "100%" },
  };

  const styles = mergeStyleSets({
    callout: {
      width: 320,
      padding: "20px 24px",
    },
    title: {
      marginBottom: 12,
      fontWeight: FontWeights.semilight,
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: 20,
    },
  });

  const handleItemInvoked = (item: any) => {
    onRowClick?.(item);
  };

  const handleSearch = async (_: any, newValue?: string) => {
    const keyword = newValue || "";
    setFilterText(keyword);
    setCurrentPage(1);

    try {
      const queryParams = new URLSearchParams();

      if (selectedCriteria && selectedValue) {
        queryParams.append("criteria", selectedCriteria);
        queryParams.append("value", selectedValue);
      }

      if (keyword) {
        queryParams.append("search", keyword);
      }

      const endpoint = isClientActive
        ? `/Business/get-all-businesses?${queryParams.toString()}`
        : `/Task/get-all-task?${queryParams.toString()}`;

      const res = await apiService.get(endpoint);
      setFilteredTableData(res.filteredData || res.businesses || res.tasks || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleApplyFilter = () => {
    handleSearch(null, filterText);
    toggleIsCalloutVisible();
  };

  const visibleItems = useMemo(() => {
    const baseItems = filteredTableData ?? items;
    if (!pageSize) return baseItems;
    const start = (currentPage - 1) * pageSize;
    return baseItems.slice(start, start + pageSize);
  }, [filteredTableData, items, currentPage, pageSize]);

  const totalPages = pageSize
    ? Math.ceil((filteredTableData ?? items).length / pageSize)
    : 1;

  return (
    <Stack styles={{ root: { width: "100%" } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {actions && <Stack.Item>{actions}</Stack.Item>}
        <Stack.Item grow styles={{ root: { display: "flex", justifyContent: "flex-end", gap: 10 } }}>
          <div style={{ position: "relative", maxWidth: 220, width: "100%" }}>
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

          <DefaultButton
            id={buttonId}
            onClick={toggleIsCalloutVisible}
            text="Add Filter"
            onRenderIcon={() => <ListFilterPlus size={20} />}
            styles={{ root: { backgroundColor: "#DEECF9", borderRadius: "15px" } }}
          />

          {isCalloutVisible && (
            <FocusTrapCallout
              role="alertdialog"
              className={styles.callout}
              gapSpace={0}
              target={`#${buttonId}`}
              onDismiss={toggleIsCalloutVisible}
              setInitialFocus
            >
              <Text block variant="xLarge" className={styles.title}>
                Add Filter
              </Text>

              <Dropdown
                placeholder="Select criteria"
                label="Criteria"
                options={filterCriteria}
                styles={dropdownStyles}
                selectedKey={selectedCriteria}
                onChange={(_, option) => {
                  setSelectedCriteria(option?.key as string);
                  setSelectedValue(undefined);
                }}
              />

              {selectedCriteria && (
                <Dropdown
                  placeholder="Select value"
                  label="Value"
                  options={filterValue?.[selectedCriteria] ?? []}
                  styles={dropdownStyles}
                  selectedKey={selectedValue}
                  onChange={(_, option) => setSelectedValue(option?.key as string)}
                />
              )}

              <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                <Stack className={styles.buttons} gap={8} horizontal>
                  <PrimaryButton
                    onClick={handleApplyFilter}
                    disabled={!selectedCriteria || !selectedValue}
                  >
                    Apply
                  </PrimaryButton>
                  <DefaultButton onClick={toggleIsCalloutVisible}>Cancel</DefaultButton>
                  <DefaultButton
                    onClick={() => {
                      setFilteredTableData(null);
                      setSelectedCriteria(undefined);
                      setSelectedValue(undefined);
                      toggleIsCalloutVisible();
                    }}
                    styles={{ root: { whiteSpace: "noWrap" } }}
                  >
                    Clear Filter
                  </DefaultButton>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>
          )}
        </Stack.Item>
      </Stack>

      {visibleItems.length > 0 ? (
        <>
          <DetailsList
            items={visibleItems}
            columns={columns as IColumn[]}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={selectionMode}
            onItemInvoked={handleItemInvoked}
            styles={{
              root: { overflowX: "auto", width: "100%" },
              headerWrapper: {
                selectors: {
                  ".ms-DetailsHeader-cell": {
                    background: "#f4f4f4 !important",
                    color: "#005a9e",
                    fontSize: "18px",
                    fontWeight: 600,
                  },
                },
              },
              contentWrapper: {
                selectors: {
                  ".ms-DetailsRow-cell": {
                    fontSize: "15px !important",
                    padding: "8px 12px",
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
                onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
              />
              <Text>Page {currentPage} of {totalPages}</Text>
              <ChevronRight
                size={20}
                style={{
                  cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage >= totalPages ? 0.3 : 1,
                }}
                onClick={() => currentPage < totalPages && setCurrentPage((p) => p + 1)}
              />
            </Stack>
          )}
        </>
      ) : (
        <Stack
          verticalAlign="center"
          horizontalAlign="center"
          tokens={{ childrenGap: 12 }}
          styles={{
            root: {
              padding: 40,
              border: "1px dashed #d0d7de",
              borderRadius: 8,
              marginTop: 24,
              background: "#fdfdfd",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            },
          }}
        >
          <Inbox size={48} color="#888" strokeWidth={1.2} />
          <Text variant="xLarge" styles={{ root: { color: "#555", fontWeight: 500 } }}>
            No data to show
          </Text>
          <Text variant="medium" styles={{ root: { color: "#777", maxWidth: 300 } }}>
            We couldn't find any records matching your current filters or search.
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default CustomTable;
