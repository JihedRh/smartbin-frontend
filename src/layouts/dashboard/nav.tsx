import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import { useTheme } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import Drawer, { drawerClasses } from "@mui/material/Drawer";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { varAlpha } from "src/theme/styles";

import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    roles?: string[];
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};


export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2,
        px: 2,
        top: 0,
        left: 0,
        height: "100vh",
        display: "none",
        position: "fixed",
        flexDirection: "column",
        zIndex: "var(--layout-nav-zIndex)",
        width: "var(--layout-nav-vertical-width)",
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey["500Channel"], 0.12)}`,

        // ✅ More Intense Blue Gradient
        background: `linear-gradient(to right, rgba(42, 65, 198, 0.9), rgba(60, 120, 255, 0.85)), 
                     url('/assets/hospital.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(10px)",

        [theme.breakpoints.up(layoutQuery)]: {
          display: "flex",
        },
        ...sx,
      }}
    >
      {/* Separated Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Logo />
      </Box>

      <NavContent data={data} slots={slots} />
    </Box>
  );
}

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [pathname, onClose, open]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2,
          px: 2,
          overflow: "unset",
          bgcolor: "#f5f7fa", 
          width: "var(--layout-nav-mobile-width)",
          color: "black",

          background: `linear-gradient(to right, rgba(50, 120, 255, 0.8), rgba(30, 90, 220, 0.85)), 
                       url('/assets/hospital.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backdropFilter: "blur(10px)",

          ...sx,
        },
      }}
    >
      {/* Separated Logo */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Logo />
      </Box>

      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();

  // ✅ Get user role from localStorage
  const role = localStorage.getItem('role') || 'user';

  // ✅ Filter data based on role
  const filteredData = data.filter((item) => item.roles?.includes(role));

  return (
    <>
      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {filteredData.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'black',
                      minHeight: 'var(--layout-nav-item-height)',

                      '&:hover': {
                        bgcolor: '#2956A3',
                        color: 'white',
                      },

                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: '#1D4E89',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2956A3',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>
                    <Box component="span" flexGrow={1}>
                      {item.title}
                    </Box>
                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}

