import React, { type SVGProps } from "react";
import * as Icons from "./../icons";

export type IconType = keyof typeof Icons;

export type IconProps = SVGProps<SVGSVGElement> & {
  icon: IconType;
};

export const Icon: React.FC<IconProps> = ({ icon, ...props }) => {
  return React.createElement(Icons[icon], props);
};
