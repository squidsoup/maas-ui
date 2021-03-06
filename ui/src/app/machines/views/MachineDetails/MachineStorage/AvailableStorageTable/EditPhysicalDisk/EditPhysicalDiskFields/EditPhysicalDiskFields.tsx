import { Col, Input, Row } from "@canonical/react-components";
import { useFormikContext } from "formik";

import type { EditPhysicalDiskValues } from "../EditPhysicalDisk";

import FormikField from "app/base/components/FormikField";
import TagSelector from "app/base/components/TagSelector";
import type { Disk } from "app/store/machine/types";
import { formatSize, formatType } from "app/store/machine/utils";

type Props = {
  disk: Disk;
};

export const EditPhysicalDiskFields = ({ disk }: Props): JSX.Element => {
  const {
    initialValues,
    setFieldValue,
  } = useFormikContext<EditPhysicalDiskValues>();
  const initialTags = initialValues.tags.map((tag) => ({ name: tag }));

  return (
    <Row>
      <Col size="5">
        <Input disabled label="Name" type="text" value={disk.name} />
        <Input disabled label="Type" type="text" value={formatType(disk)} />
        <Input
          disabled
          label="Size"
          type="text"
          value={formatSize(disk.size)}
        />
      </Col>
      <Col emptyLarge="7" size="5">
        <FormikField
          allowNewTags
          component={TagSelector}
          initialSelected={initialTags}
          label="Tags"
          name="tags"
          onTagsUpdate={(selectedTags: { name: string }[]) => {
            setFieldValue(
              "tags",
              selectedTags.map((tag) => tag.name)
            );
          }}
          placeholder="Select or create tags"
          tags={initialTags}
        />
      </Col>
    </Row>
  );
};

export default EditPhysicalDiskFields;
