import { Col, Row, Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import domainSelectors from "app/store/domain/selectors";
import FormikField from "app/base/components/FormikField";
import PowerTypeFields from "app/machines/components/PowerTypeFields";

export const AddChassisFormFields = ({ chassisPowerTypes }) => {
  const domains = useSelector(domainSelectors.all);

  const formikProps = useFormikContext();
  const { values } = formikProps;

  const domainOptions = [
    { label: "Select your domain", value: "", disabled: true },
    ...domains.map((domain) => ({
      key: `domain-${domain.id}`,
      label: domain.name,
      value: domain.name,
    })),
  ];

  return (
    <Row>
      <Col size="5">
        <FormikField
          component={Select}
          label="Domain"
          name="domain"
          options={domainOptions}
          required
        />
      </Col>
      <Col size="5">
        <PowerTypeFields
          driverType="chassis"
          formikProps={formikProps}
          powerTypes={chassisPowerTypes}
          selectedPowerType={values.power_type}
        />
      </Col>
    </Row>
  );
};

export default AddChassisFormFields;
