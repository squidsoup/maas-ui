import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import CreateRaidFields from "./CreateRaidFields";

import FormCard from "app/base/components/FormCard";
import FormCardButtons from "app/base/components/FormCardButtons";
import FormikForm from "app/base/components/FormikForm";
import { useMachineDetailsForm } from "app/machines/hooks";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import type { Disk, Machine, Partition } from "app/store/machine/types";
import { DiskTypes } from "app/store/machine/types";
import { isDisk, isRaid } from "app/store/machine/utils";
import type { RootState } from "app/store/root/types";

export type CreateRaidValues = {
  fstype?: string;
  mountOptions?: string;
  mountPoint?: string;
  name: string;
  tags: string[];
};

type Props = {
  closeForm: () => void;
  selected: (Disk | Partition)[];
  systemId: Machine["system_id"];
};

const getInitialName = (disks: Disk[]) => {
  if (!disks || disks.length === 0) {
    return "md0";
  }
  const raidCount = disks.reduce<number>(
    (count, disk) => (isRaid(disk) ? count + 1 : count),
    0
  );
  return `md${raidCount}`;
};

const CreateRaidSchema = Yup.object().shape({
  fstype: Yup.string(),
  mountOptions: Yup.string(),
  mountPoint: Yup.string().when("fstype", {
    is: (val: CreateRaidValues["fstype"]) => Boolean(val),
    then: Yup.string().matches(/^\//, "Mount point must start with /"),
  }),
  name: Yup.string().required("Name is required"),
  tags: Yup.array().of(Yup.string()),
});

export const CreateRaid = ({
  closeForm,
  selected,
  systemId,
}: Props): JSX.Element | null => {
  const dispatch = useDispatch();
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, systemId)
  );
  const { errors, saved, saving } = useMachineDetailsForm(
    systemId,
    "creatingRaid",
    "createRaid",
    () => closeForm()
  );

  if (machine && "disks" in machine) {
    return (
      <FormCard sidebar={false}>
        <FormikForm
          allowUnchanged
          buttons={FormCardButtons}
          cleanup={machineActions.cleanup}
          errors={errors}
          initialValues={{
            fstype: "",
            mountOptions: "",
            mountPoint: "",
            name: getInitialName(machine.disks),
            tags: [],
          }}
          onCancel={closeForm}
          onSaveAnalytics={{
            action: "Create RAID",
            category: "Machine storage",
            label: "Create RAID",
          }}
          onSubmit={(values: CreateRaidValues) => {
            const { fstype, mountOptions, mountPoint, name, tags } = values;
            const [blockDeviceIds, partitionIds] = selected.reduce<number[][]>(
              ([diskIds, partitionIds], storageDevice: Disk | Partition) => {
                if (isDisk(storageDevice)) {
                  diskIds.push(storageDevice.id);
                } else {
                  partitionIds.push(storageDevice.id);
                }
                return [diskIds, partitionIds];
              },
              [[], []]
            );
            const params = {
              // TODO: Replace with dynamic value
              level: DiskTypes.RAID_0,
              name,
              systemId,
              tags,
              ...(fstype && { fstype }),
              ...(fstype && mountOptions && { mountOptions }),
              ...(fstype && mountPoint && { mountPoint }),
              ...(blockDeviceIds.length > 0 && { blockDeviceIds }),
              ...(partitionIds.length > 0 && { partitionIds }),
            };
            dispatch(machineActions.createRaid(params));
          }}
          saved={saved}
          saving={saving}
          submitLabel="Create RAID"
          validationSchema={CreateRaidSchema}
        >
          <CreateRaidFields storageDevices={selected} systemId={systemId} />
        </FormikForm>
      </FormCard>
    );
  }
  return null;
};

export default CreateRaid;