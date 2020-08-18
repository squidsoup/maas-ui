import pluralize from "pluralize";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";

import type { RootState } from "app/store/root/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import KVMActionFormWrapper from "app/kvm/components/KVMActionFormWrapper";
import KVMDetailsActionMenu from "./KVMDetailsActionMenu";
import SectionHeader from "app/base/components/SectionHeader";

type RouteParams = {
  id: string;
};

const KVMDetailsHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams<RouteParams>();
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, Number(id))
  );
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  useEffect(() => {
    dispatch(podActions.fetch());
  }, [dispatch]);

  // If path is not exactly "/kvm/<pod.id>" close the form.
  useEffect(() => {
    if (location.pathname !== `/kvm/${id}`) {
      setSelectedAction("");
    }
  }, [id, location.pathname]);

  return (
    <SectionHeader
      buttons={
        !selectedAction && location.pathname.endsWith(`/kvm/${id}`)
          ? [
              <KVMDetailsActionMenu
                key="action-dropdown"
                setSelectedAction={setSelectedAction}
              />,
            ]
          : undefined
      }
      formWrapper={
        (selectedAction && (
          <KVMActionFormWrapper
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        )) ||
        undefined
      }
      loading={!pod}
      subtitle={pluralize(
        "composed machine",
        pod?.composed_machines_count,
        true
      )}
      tabLinks={[
        {
          active: location.pathname.endsWith(`/kvm/${id}`),
          label: "Resources",
          path: `/kvm/${id}`,
        },
        {
          active: location.pathname.endsWith(`/kvm/${id}/edit`),
          label: "Configuration",
          path: `/kvm/${id}/edit`,
        },
      ]}
      title={pod?.name || ""}
    />
  );
};

export default KVMDetailsHeader;