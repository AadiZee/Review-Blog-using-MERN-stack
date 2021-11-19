import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { Grid, TextField, Divider } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EmailStepper from "../stepper/email";

const AuthProfile = () => {
  const [emailModal, setEmailModal] = useState(false);
  const users = useSelector((state) => state.users);
  const notifications = useSelector((state) => state.notifications);

  const closeModal = () => {
    setEmailModal(false);
  };
  const openModal = () => {
    setEmailModal(true);
  };

  useEffect(() => {
    if (notifications && notifications.success) {
      closeModal();
    }
  }, [notifications]);

  return (
    <div>
      <div className="mb-3 auth_grid">
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <TextField value={users.data.email} disabled />
          </Grid>
          <Grid item>
            <EditIcon color="primary" onClick={openModal} />
          </Grid>
        </Grid>

        <Grid container spacing={1} alignItems="flex-end">
          <Grid item>
            <TextField value="********" disabled />
          </Grid>
          <Grid item>
            <EditIcon color="primary" />
          </Grid>
        </Grid>
      </div>

      {/* email modal */}

      <Modal size="lg" centered show={emailModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmailStepper user={users} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AuthProfile;
