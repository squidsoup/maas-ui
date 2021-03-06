import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import ActionForm from "app/base/components/ActionForm";
import type { RouteParams } from "app/base/types";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";

type Props = {
  setSelectedAction: (action: string | null) => void;
};

const DeleteForm = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const { id } = useParams<RouteParams>();
  const errors = useSelector(podSelectors.errors);
  const selectedRSDIDs = useSelector(podSelectors.selectedRSDs).map(
    (rsd) => rsd.id
  );
  const deletingSelected = useSelector(podSelectors.deletingSelected);
  const rsdsToDelete = id ? [Number(id)] : selectedRSDIDs;
  const cleanup = useCallback(() => podActions.cleanup(), []);

  return (
    <ActionForm
      actionName="delete"
      cleanup={cleanup}
      clearSelectedAction={() => setSelectedAction(null)}
      errors={errors}
      modelName="RSD"
      onSubmit={() => {
        rsdsToDelete.forEach((kvmID) => {
          dispatch(podActions.delete(kvmID));
        });
      }}
      processingCount={deletingSelected.length}
      selectedCount={rsdsToDelete.length}
      submitAppearance="negative"
    />
  );
};

export default DeleteForm;
