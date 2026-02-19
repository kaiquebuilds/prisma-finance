import type { ComponentPropsWithoutRef, ElementType } from "react";

type IconProps = {
  as: ElementType;
  size?: number;
  title?: string;
} & ComponentPropsWithoutRef<"svg">;

export function Icon({ as: Svg, size = 20, title, ...props }: IconProps) {
  const a11yProps = title
    ? { role: "img" as const }
    : { "aria-hidden": true as const, focusable: false };

  return (
    <Svg width={size} height={size} {...a11yProps} {...props}>
      {title ? <title>{title}</title> : null}
    </Svg>
  );
}
