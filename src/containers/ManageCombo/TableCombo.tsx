/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CTable from "../../components/table/CTable";
import adminComboAPI from "../../api/Services/adminComboAPI";
import config from "../../configs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MenuActionTableCombo from "../../components/menuAction/menuActionTableCombo/menuActionTableCombo";

interface GroupData {
  groupIdentifier: string;
  combos: any[];
  isOpen: boolean;
}

const TableCombo = () => {
  // Declare state
  const [selectedData, setSelectedData] = useState<any>();
  const [size, setSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dataCombo, setDataCombo] = useState<any[]>([]);
  const [groupedData, setGroupedData] = useState<GroupData[]>([]);
  const [isCustomizable, setIsCustomizable] = useState<boolean>(true); // Default: true
  const [displayMode, setDisplayMode] = useState<"flat" | "grouped">("flat");
  const navigate = useNavigate();

  // Select row
  const selecteData = (row: any) => {
    setSelectedData(row);
  };

  // Process the data to group by groupIdentifier
  useEffect(() => {
    if (isCustomizable && dataCombo.length > 0) {
      // Group the data by groupIdentifier
      const groups: { [key: string]: any[] } = {};

      dataCombo.forEach((combo) => {
        if (combo.groupIdentifier) {
          if (!groups[combo.groupIdentifier]) {
            groups[combo.groupIdentifier] = [];
          }
          groups[combo.groupIdentifier].push(combo);
        } else {
          // For items without groupIdentifier, create a unique key
          const uniqueKey = `single_${combo.comboId}`;
          groups[uniqueKey] = [combo];
        }
      });

      // Convert to array format with isOpen state
      const groupsArray: GroupData[] = Object.keys(groups).map((key) => ({
        groupIdentifier: key,
        combos: groups[key],
        isOpen: false,
      }));

      setGroupedData(groupsArray);
      setDisplayMode("grouped");
    } else {
      setDisplayMode("flat");
    }
  }, [dataCombo, isCustomizable]);

  // Fetch combos
  useEffect(() => {
    const getListCombo = async () => {
      try {
        const res: any = await adminComboAPI.getListCombo({
          pageNumber: page + 1,
          pageSize: size,
          isCustomizable,
        });
        setDataCombo(res?.items || []);
        setTotal(res?.totalCount || 0);
      } catch (error: any) {
        console.error("Error fetching combos:", error?.message);
      }
    };
    getListCombo();
  }, [page, size, isCustomizable]);

  // Handle group expansion toggle
  const toggleGroup = (groupIndex: number) => {
    setGroupedData((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        isOpen: !newGroups[groupIndex].isOpen,
      };
      return newGroups;
    });
  };

  // Navigate to create custom combo tab
  const navigateToCustomComboCreate = () => {
    navigate(config.adminRoutes.createHotPotCombo, {
      state: { targetTab: "custom" },
    });
  };

  // Navigate to regular combo create tab
  const navigateToRegularComboCreate = () => {
    navigate(config.adminRoutes.createHotPotCombo);
  };

  // Table headers
  const tableHeader = [
    { id: "name", label: "Tên món lẩu", align: "center" },
    { id: "imageURLs", label: "Hình ảnh", align: "center" },
    { id: "isCustomizable", label: "Tự tạo mới", align: "center" },
    { id: "appliedDiscountPercentage", label: "Giảm giá", align: "center" },
    { id: "createdAt", label: "Ngày tạo", align: "center", format: "date" },
  ];

  // Pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const ActionCreateNewCombo = () => {
    return (
      <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={navigateToRegularComboCreate}
        >
          Tạo combo mới
        </Button>
      </Box>
    );
  };

  // Navigate to regular combo create group
  const navigateToRegularComboCreateGroup = (groupIdentifier: string) => {
    navigate(
      `${config.adminRoutes.createGroupCombo}?groupIdentifier=${groupIdentifier}`
    );
  };

  const ActionCreateNewComboGroup = ({
    groupIdentifier,
  }: {
    groupIdentifier: string;
  }) => {
    return (
      <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => navigateToRegularComboCreateGroup(groupIdentifier)}
        >
          Tạo combo mới
        </Button>
      </Box>
    );
  };

  // Custom table renderer for grouped data
  const CustomGroupedTable = () => {
    return (
      <div>
        {groupedData.map((group, groupIndex) => (
          <div key={group.groupIdentifier} style={{ marginBottom: "10px" }}>
            {/* Group header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => toggleGroup(groupIndex)}
                aria-label={group.isOpen ? "collapse" : "expand"}
              >
                {group.isOpen ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{ ml: 1, fontWeight: "bold" }}
              >
                Combo Group: {group.combos[0]?.name || "Unknown"}
                {group.combos.length > 1
                  ? ` (${group.combos.length} variants)`
                  : ""}
              </Typography>
            </Box>

            {/* Expanded content */}
            <Collapse in={group.isOpen}>
              <CTable
                data={group.combos}
                tableHeaderTitle={tableHeader}
                title=""
                menuAction={
                  <MenuActionTableCombo
                    hotpotData={selectedData}
                    onOpenDetail={selecteData}
                  />
                }
                eventAction={
                  <ActionCreateNewComboGroup
                    groupIdentifier={group.groupIdentifier}
                  />
                }
                selectedData={selecteData}
                size={size}
                page={0}
                total={group.combos.length}
                handleChangePage={() => {}}
                handleChangeRowsPerPage={() => {}}
              />
            </Collapse>
          </div>
        ))}
      </div>
    );
  };

  // Action buttons
  const EventAction = () => {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Lọc theo tùy chỉnh</InputLabel>
          <Select
            value={isCustomizable ? "true" : "false"}
            label="Lọc theo tùy chỉnh"
            onChange={(e: SelectChangeEvent<string>) => {
              setIsCustomizable(e.target.value === "true");
              setPage(0); // Reset page
            }}
          >
            <MenuItem value="true">Tự tạo mới</MenuItem>
            <MenuItem value="false">Không tự tạo</MenuItem>
          </Select>
        </FormControl>
        {isCustomizable && (
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={navigateToCustomComboCreate}
          >
            Tạo combo tuỳ chỉnh mới
          </Button>
        )}
      </Box>
    );
  };

  return (
    <>
      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 2,
          p: 2,
        }}
      >
        Quản lý Combo Lẩu
      </Typography>

      {/* Actions */}
      <Box sx={{ p: 2 }}>
        <EventAction />
      </Box>

      {/* Table display based on mode */}
      {displayMode === "grouped" && isCustomizable ? (
        <CustomGroupedTable />
      ) : (
        <CTable
          data={dataCombo}
          tableHeaderTitle={tableHeader}
          title="Bảng Combo Lẩu"
          menuAction={
            <MenuActionTableCombo
              hotpotData={selectedData}
              onOpenDetail={selecteData}
            />
          }
          eventAction={<ActionCreateNewCombo />}
          selectedData={selecteData}
          size={size}
          page={page}
          total={total}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </>
  );
};

export default TableCombo;
