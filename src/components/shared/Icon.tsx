import React, { type SVGProps } from "react";
import * as Icons from "./../icons";
import cx from "classnames";

export type IconType = keyof typeof Icons;

export type IconProps = SVGProps<SVGSVGElement> & {
  icon: IconType;
  size?: "s" | "m";
};

export const Icon: React.FC<IconProps> = ({ icon, size = "s", className, ...props }) => {
  const Component = React.createElement(Icons[icon], props);

  return (
    <span
      className={cx(
        "icon inline-flex",
        { "h-4 w-4": size === "s", "h-5 w-5": size === "m"},
        className
      )}
    >
      {Component}
    </span>
  );
};
