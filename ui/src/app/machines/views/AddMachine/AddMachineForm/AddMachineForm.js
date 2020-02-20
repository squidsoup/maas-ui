import { Loader } from "@canonical/react-components";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import {
  domain as domainActions,
  general as generalActions,
  machine as machineActions,
  resourcepool as resourcePoolActions,
  zone as zoneActions
} from "app/base/actions";
import {
  domain as domainSelectors,
  general as generalSelectors,
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors,
  zone as zoneSelectors
} from "app/base/selectors";
import { useAddMessage, useWindowTitle } from "app/base/hooks";
import AddMachineFormFields from "../AddMachineFormFields";
import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import FormCardButtons from "app/base/components/FormCardButtons";

/**
 * React expects controlled inputs to have some associated state. Because the
 * power parameters are dynamic and dependent on what power type is selected,
 * the form is initialised with all possible power parameters from all power
 * types. Before the create machine action is dispatched, the power parameters
 * are trimmed to only those relevant to the selected power type.
 *
 * @param {Object} powerType - selected power type
 * @param {Object} powerParameters - all power parameters entered in Formik form
 * @returns {Object} power parameters relevant to selected power type
 */
const trimPowerParameters = (powerType, powerParameters) => {
  const trimmedParameters = {};
  if (powerType && powerType.fields) {
    powerType.fields.forEach(field => {
      trimmedParameters[field.name] = powerParameters[field.name];
    });
  }
  return trimmedParameters;
};

const generateMachineSchema = parametersSchema =>
  Yup.object().shape({
    architecture: Yup.string().required("Architecture required"),
    domain: Yup.string().required("Domain required"),
    extra_macs: Yup.array().of(
      Yup.string().matches(
        /^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/,
        "Invalid MAC address"
      )
    ),
    hostname: Yup.string(),
    min_hwe_kernel: Yup.string(),
    pool: Yup.string().required("Resource pool required"),
    power_parameters: Yup.object().shape(parametersSchema),
    power_type: Yup.string().required("Power type required"),
    pxe_mac: Yup.string()
      .matches(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address")
      .required("At least one MAC address required"),
    zone: Yup.string().required("Zone required")
  });

export const AddMachineForm = () => {
  const dispatch = useDispatch();

  const architectures = useSelector(generalSelectors.architectures.get);
  const architecturesLoaded = useSelector(
    generalSelectors.architectures.loaded
  );
  const defaultMinHweKernel = useSelector(
    generalSelectors.defaultMinHweKernel.get
  );
  const defaultMinHweKernelLoaded = useSelector(
    generalSelectors.defaultMinHweKernel.loaded
  );
  const domains = useSelector(domainSelectors.all);
  const domainsLoaded = useSelector(domainSelectors.loaded);
  const hweKernelsLoaded = useSelector(generalSelectors.hweKernels.loaded);
  const machineSaved = useSelector(machineSelectors.saved);
  const machineSaving = useSelector(machineSelectors.saving);
  const machineErrors = useSelector(machineSelectors.errors);
  const powerTypes = useSelector(generalSelectors.powerTypes.get);
  const powerTypesLoaded = useSelector(generalSelectors.powerTypes.loaded);
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const zones = useSelector(zoneSelectors.all);
  const zonesLoaded = useSelector(zoneSelectors.loaded);

  const [savingMachine, setSavingMachine] = useState(false);
  const [powerType, setPowerType] = useState("");
  const [MachineSchema, setMachineSchema] = useState(generateMachineSchema({}));

  // Fetch all data required for the form.
  useEffect(() => {
    dispatch(domainActions.fetch());
    dispatch(generalActions.fetchArchitectures());
    dispatch(generalActions.fetchDefaultMinHweKernel());
    dispatch(generalActions.fetchHweKernels());
    dispatch(generalActions.fetchPowerTypes());
    dispatch(resourcePoolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  // When selected power type changes, update the validation schema with new
  // power_parameters shape.
  useEffect(() => {
    if (powerType) {
      const parametersSchema = powerType.fields.reduce((schema, field) => {
        if (field.required) {
          schema[field.name] = Yup.string().required(`${field.label} required`);
        } else {
          schema[field.name] = Yup.string();
        }
        return schema;
      }, {});
      const newMachineSchema = generateMachineSchema(parametersSchema);
      setMachineSchema(newMachineSchema);
    }
  }, [powerType]);

  useWindowTitle("Add machine");

  useAddMessage(
    machineSaved,
    machineActions.cleanup,
    `${savingMachine} added successfully.`,
    setSavingMachine
  );

  // Calculate all possible power parameters from every power type and memoize.
  // Used to initialise form so React doesn't complain about unexpected values.
  // Parameters are trimmed to only relevant parameters on form submit.
  const allPowerParameters = useMemo(
    () =>
      powerTypes.reduce((parameters, powerType) => {
        powerType.fields.forEach(field => {
          if (!(field.name in parameters)) {
            parameters[field.name] = field.default;
          }
        });
        return parameters;
      }, {}),
    [powerTypes]
  );

  const allLoaded =
    architecturesLoaded &&
    defaultMinHweKernelLoaded &&
    domainsLoaded &&
    hweKernelsLoaded &&
    powerTypesLoaded &&
    resourcePoolsLoaded &&
    zonesLoaded;

  let errors = "";
  if (machineErrors && typeof machineErrors === "string") {
    errors = machineErrors;
  } else if (machineErrors && typeof machineErrors === "object") {
    Object.keys(machineErrors).forEach(key => {
      errors = errors + `${machineErrors[key]} `;
    });
  }

  return (
    <>
      {!allLoaded ? (
        <Loader text="Loading" />
      ) : (
        <FormCard sidebar={false} title="Add machine">
          <FormikForm
            buttons={FormCardButtons}
            cleanup={machineActions.cleanup}
            errors={errors}
            initialValues={{
              architecture: (architectures.length && architectures[0]) || "",
              domain: (domains.length && domains[0].name) || "",
              extra_macs: [],
              hostname: "",
              min_hwe_kernel: defaultMinHweKernel || "",
              pool: (resourcePools.length && resourcePools[0].name) || "",
              power_parameters: allPowerParameters,
              power_type: "",
              pxe_mac: "",
              zone: (zones.length && zones[0].name) || ""
            }}
            onSaveAnalytics={{
              action: "Save",
              category: "Machine",
              label: "Add machine form"
            }}
            onSubmit={values => {
              const params = {
                architecture: values.architecture,
                domain: domains.find(domain => domain.name === values.domain),
                extra_macs: values.extra_macs,
                hostname: values.hostname,
                min_hwe_kernel: values.min_hwe_kernel,
                pool: resourcePools.find(pool => pool.name === values.pool),
                power_parameters: trimPowerParameters(
                  powerType,
                  values.power_parameters
                ),
                power_type: values.power_type,
                pxe_mac: values.pxe_mac,
                zone: zones.find(zone => zone.name === values.zone)
              };
              dispatch(machineActions.create(params));
              setSavingMachine(values.hostname || "Machine");
            }}
            onValuesChanged={values => {
              const powerType = powerTypes.find(
                type => type.name === values.power_type
              );
              setPowerType(powerType);
            }}
            saving={machineSaving}
            saved={machineSaved}
            savedRedirect="/machines"
            submitLabel="Save machine"
            validationSchema={MachineSchema}
          >
            <AddMachineFormFields />
          </FormikForm>
        </FormCard>
      )}
    </>
  );
};

export default AddMachineForm;