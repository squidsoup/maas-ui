import { useEffect, useRef, useState } from "react";

import { Icon, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";

import type { SelectedAction, SetSelectedAction } from "../MachineSummary";

import MachineName from "./MachineName";

import LegacyLink from "app/base/components/LegacyLink";
import SectionHeader from "app/base/components/SectionHeader";
import TableMenu from "app/base/components/TableMenu";
import { useMachineActions } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import ActionFormWrapper from "app/machines/components/ActionFormWrapper";
import TakeActionMenu from "app/machines/components/TakeActionMenu";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type Props = {
  selectedAction: SelectedAction | null;
  setSelectedAction: SetSelectedAction;
};

const MachineHeader = ({
  selectedAction,
  setSelectedAction,
}: Props): JSX.Element => {
  const [editingName, setEditingName] = useState(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams<RouteParams>();
  const loading = useSelector(machineSelectors.loading);
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const statuses = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, id)
  );
  const powerMenuRef = useRef<HTMLSpanElement>(null);
  const powerMenuLinks = useMachineActions(id, [
    NodeActions.OFF,
    NodeActions.ON,
  ]);

  useEffect(() => {
    dispatch(machineActions.get(id));
  }, [dispatch, id]);

  if (!machine || !("devices" in machine)) {
    return <SectionHeader loading title="" />;
  }

  const { devices, system_id } = machine;
  const urlBase = `/machine/${system_id}`;
  const checkingPower = statuses?.checkingPower;

  return (
    <SectionHeader
      buttons={
        !selectedAction
          ? [
              <TakeActionMenu
                key="action-dropdown"
                setSelectedAction={setSelectedAction}
              />,
            ]
          : null
      }
      formWrapper={
        selectedAction ? (
          <ActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        ) : null
      }
      loading={loading}
      subtitle={
        editingName
          ? null
          : [
              <>
                {machine.locked ? (
                  <Tooltip
                    className="u-nudge-left--small"
                    message="This machine is locked. You have to unlock it to perform any actions."
                    position="btm-left"
                  >
                    <Icon name="locked" />
                  </Tooltip>
                ) : null}
                {machine.status}
              </>,
              <>
                <span className="u-nudge-left--small">
                  <i
                    className={
                      checkingPower
                        ? "p-icon--spinner u-animation--spin"
                        : `p-icon--power-${machine.power_state}`
                    }
                  />
                </span>
                <span data-test="machine-header-power" ref={powerMenuRef}>
                  {checkingPower
                    ? "Checking power"
                    : `Power ${machine.power_state}`}
                </span>
                <TableMenu
                  className="u-nudge-right--small"
                  links={[
                    ...(Array.isArray(powerMenuLinks)
                      ? powerMenuLinks
                      : [powerMenuLinks]),
                    {
                      children: "Check power",
                      onClick: () => {
                        dispatch(machineActions.checkPower(system_id));
                      },
                    },
                  ]}
                  positionNode={powerMenuRef?.current}
                  title="Take action:"
                />
              </>,
            ]
      }
      tabLinks={[
        {
          active: pathname.startsWith(`${urlBase}/summary`),
          component: Link,
          label: "Summary",
          to: `${urlBase}/summary`,
        },
        ...(devices?.length >= 1
          ? [
              {
                active: pathname.startsWith(`${urlBase}/instances`),
                component: Link,
                label: "Instances",
                route: `${urlBase}/instances`,
              },
            ]
          : []),
        {
          active: pathname.startsWith(`${urlBase}/network`),
          component: LegacyLink,
          label: "Network",
          route: `${urlBase}?area=network`,
        },
        {
          active: pathname.startsWith(`${urlBase}/storage`),
          component: LegacyLink,
          label: "Storage",
          route: `${urlBase}?area=storage`,
        },
        {
          active: pathname.startsWith(`${urlBase}/pci-devices`),
          component: Link,
          label: "PCI devices",
          to: `${urlBase}/pci-devices`,
        },
        {
          active: pathname.startsWith(`${urlBase}/usb-devices`),
          component: Link,
          label: "USB",
          to: `${urlBase}/usb-devices`,
        },
        {
          active: pathname.startsWith(`${urlBase}/commissioning`),
          component: LegacyLink,
          label: "Commissioning",
          route: `${urlBase}?area=commissioning`,
        },
        {
          active: pathname.startsWith(`${urlBase}/tests`),
          component: LegacyLink,
          label: "Tests",
          route: `${urlBase}?area=testing`,
        },
        {
          active: pathname.startsWith(`${urlBase}/logs`),
          component: LegacyLink,
          label: "Logs",
          route: `${urlBase}?area=logs`,
        },
        {
          active: pathname.startsWith(`${urlBase}/events`),
          component: LegacyLink,
          label: "Events",
          route: `${urlBase}?area=events`,
        },
        {
          active: pathname.startsWith(`${urlBase}/configuration`),
          component: LegacyLink,
          label: "Configuration",
          route: `${urlBase}?area=configuration`,
        },
      ]}
      title={
        <MachineName
          editingName={editingName}
          id={id}
          setEditingName={setEditingName}
        />
      }
    />
  );
};

export default MachineHeader;
