import { Col, Spinner, Row } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { config as configActions } from "app/settings/actions";
import { general as generalActions } from "app/base/actions";
import { useWindowTitle } from "app/base/hooks";
import configSelectors from "app/store/config/selectors";
import generalSelectors from "app/store/general/selectors";
import DeployForm from "app/settings/views/Configuration/DeployForm";

const Deploy = () => {
  const configLoaded = useSelector(configSelectors.loaded);
  const configLoading = useSelector(configSelectors.loading);
  const osInfoLoaded = useSelector(generalSelectors.osInfo.loaded);
  const osInfoLoading = useSelector(generalSelectors.osInfo.loading);
  const loaded = configLoaded && osInfoLoaded;
  const loading = configLoading || osInfoLoading;
  const dispatch = useDispatch();

  useWindowTitle("Deploy");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
      dispatch(generalActions.fetchOsInfo());
    }
  }, [dispatch, loaded]);

  return (
    <Row>
      <Col size={6}>
        {loading && <Spinner text="Loading..." />}
        {loaded && <DeployForm />}
      </Col>
    </Row>
  );
};

export default Deploy;
