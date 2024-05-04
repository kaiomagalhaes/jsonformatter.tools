import Link from "@mui/material/Link";
import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const defaultData = {
  company: { href: "https://codelitt.com/", name: "Codelitt" },
};

const Footer = () => {
  const { company } = defaultData;
  const { href, name } = company;

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      pt={2}
      px={1.5}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={12}
        px={1.5}
      >
        <Typography>&copy; {new Date().getFullYear()}, made with</Typography>
        <Box fontSize={4} color="red">
          <FavoriteIcon fontSize="small" />
        </Box>
        <Typography>by</Typography>
        <Link href={href} target="_blank">
          <Typography>&nbsp;Codelitt&nbsp;</Typography>
        </Link>
        <Typography>for a better developer experience.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
