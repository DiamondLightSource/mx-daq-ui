import {
  Navbar,
  NavLinks,
  NavLink,
  type ImageColourSchemeSwitchType,
} from "@diamondlightsource/sci-react-ui";
import { Link } from "react-router-dom";
import i24ssx from "../assets/i24ssx.svg";

// import { i24ssx } from "../assets/i24ssx.svg";

const ssxLogo: ImageColourSchemeSwitchType = {
  src: i24ssx,
  srcDark: i24ssx,
  alt: "i24 ssx",
  width: "100",
};

export function SerialNavBar() {
  return (
    <Navbar logo={ssxLogo} containerWidth={false}>
      <NavLinks>
        <NavLink linkComponent={Link} to="/">
          Home
        </NavLink>
        <NavLink linkComponent={Link} to="/fixed-target">
          Fixed Target
        </NavLink>
      </NavLinks>
    </Navbar>
  );
}
