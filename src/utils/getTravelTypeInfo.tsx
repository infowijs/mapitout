import React, { ReactNode } from "react";
import { t } from "@lingui/macro";

import { TransportType } from "../enums";
import { BikeIcon, BusBikeIcon, BusIcon, CarIcon, WalkIcon } from "../icons";

export function getTravelTypeInfo(type: TransportType | undefined) {
  let name!: any;
  let icon!: ReactNode;

  switch (type) {
    case TransportType.Driving:
      name = t`Driving`;
      icon = <CarIcon />;
      break;
    case TransportType.Cycling:
      name = t`Cycling`;
      icon = <BikeIcon />;
      break;
    case TransportType.PublicTransport:
      name = t`Public transport`;
      icon = <BusIcon />;
      break;
    case TransportType.Cycling_PublicTransport:
      name = t`Public transport & cycling`;
      icon = <BusBikeIcon />;
      break;
    case TransportType.Walking:
      name = t`Walking`;
      icon = <WalkIcon />;
      break;
    default:
      name = "";
      icon = null;
      break;
  }

  return { name, icon };
}
