import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import styles from './OrganizationAgendaItems.module.css';
import dayjs from 'dayjs';

interface InterfaceFormStateType {
  assigneeId: string;
  assignee: string;
  assigner: string;
  isCompleted: boolean;
  preCompletionNotes: string;
  postCompletionNotes: string;
}

interface InterfaceAgendaItemCreateModalProps {
  agendaItemPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateModal: () => void;
  toggleDeleteModal: () => void;
  formState: InterfaceFormStateType;
  t: (key: string) => string;
  dueDate: Date | null;
  completionDate: Date | null;
  assignmentDate: Date | null;
}

const AgendaItemPreviewModal: React.FC<InterfaceAgendaItemCreateModalProps> = ({
  agendaItemPreviewModalIsOpen,
  hidePreviewModal,
  showUpdateModal,
  toggleDeleteModal,
  formState,
  t,
  dueDate,
  completionDate,
  assignmentDate,
}) => {
  return (
    <>
      <Modal
        className={styles.agendaItemModal}
        show={agendaItemPreviewModalIsOpen}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('agendaItemDetails')}</p>
          <Button
            onClick={hidePreviewModal}
            data-testid="previewAgendaItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
              <p className={styles.preview}>
                {t('assignee')}:{' '}
                <span className={styles.view}>{formState.assignee}</span>
              </p>
              <p className={styles.preview}>
                {t('assigner')}:{' '}
                <span className={styles.view}>{formState.assigner}</span>
              </p>
              <p className={styles.preview}>
                {t('preCompletionNotes')}:
                <span className={styles.view}>
                  {formState.preCompletionNotes}
                </span>
              </p>
              <p className={styles.preview}>
                {t('postCompletionNotes')}:
                <span className={styles.view}>
                  {formState.postCompletionNotes}
                </span>
              </p>
              <p className={styles.preview}>
                {t('assignmentDate')}:{' '}
                <span className={styles.view}>
                  {dayjs(assignmentDate).format('YYYY-MM-DD')}
                </span>
              </p>
              <p className={styles.preview}>
                {t('dueDate')}:{' '}
                <span className={styles.view}>
                  {dayjs(dueDate).format('YYYY-MM-DD')}
                </span>
              </p>
              <p className={styles.preview}>
                {t('completionDate')}:{' '}
                <span className={styles.view}>
                  {dayjs(completionDate).format('YYYY-MM-DD')}
                </span>
              </p>
              <p className={styles.preview}>
                {t('status')}:{' '}
                <span className={styles.view}>
                  {formState.isCompleted ? 'Completed' : 'Active'}
                </span>
              </p>
            </div>
            <div className={styles.iconContainer}>
              <Button
                size="sm"
                data-testid="editAgendaItemPreviewModalBtn"
                className={styles.icon}
                onClick={() => {
                  hidePreviewModal();
                  showUpdateModal();
                }}
              >
                {' '}
                <i className="fas fa-edit"></i>
              </Button>
              <Button
                size="sm"
                data-testid="deleteAgendaItemPreviewModalBtn"
                className={`${styles.icon} ms-2`}
                onClick={toggleDeleteModal}
                variant="danger"
              >
                {' '}
                <i className="fa fa-trash"></i>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AgendaItemPreviewModal;
