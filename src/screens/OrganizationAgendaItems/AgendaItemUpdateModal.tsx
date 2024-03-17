import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import styles from './OrganizationAgendaItems.module.css';
import type { InterfaceMemberInfo } from 'utils/interfaces';

interface InterfaceFormStateType {
  assigneeId: string;
  assignee: string;
  assigner: string;
  isCompleted: boolean;
  preCompletionNotes: string;
  postCompletionNotes: string;
}

interface InterfaceAgendaItemCreateModalProps {
  agendaItemUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  membersData: InterfaceMemberInfo[] | undefined;
  dueDate: Date | null;
  setDueDate: (state: React.SetStateAction<Date | null>) => void;
  completionDate: Date | null;
  setCompletionDate: (state: React.SetStateAction<Date | null>) => void;
}

const AgendaItemUpdateModal: React.FC<InterfaceAgendaItemCreateModalProps> = ({
  agendaItemUpdateModalIsOpen,
  hideUpdateModal,
  formState,
  setFormState,
  updateAgendaItemHandler,
  t,
  membersData,
  dueDate,
  setDueDate,
  completionDate,
  setCompletionDate,
}) => {
  return (
    <>
      <Modal
        className={styles.agendaItemModal}
        show={agendaItemUpdateModalIsOpen}
        onHide={hideUpdateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('agendaItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideUpdateModal}
            data-testid="updateAgendaItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateAgendaItemHandler}>
            <Form.Group className="mb-2">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                data-testid="formUpdateAssignee"
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {formState.assignee}
                </option>
                {membersData?.map((member, index) => {
                  const currMemberName = `${member.firstName} ${member.lastName}`;
                  if (currMemberName !== formState.assignee) {
                    return (
                      <option key={index} value={member._id}>
                        {`${member.firstName} ${member.lastName}`}
                      </option>
                    );
                  }
                })}
              </Form.Select>
            </Form.Group>

            <label htmlFor="agendaItemPreCompletionNotes">
              {t('preCompletionNotes')}
            </label>
            <Form.Control
              type="agendaItemPreCompletionNotes"
              id="agendaItemPreCompletionNotes"
              placeholder={t('preCompletionNotes')}
              autoComplete="off"
              value={formState.preCompletionNotes || ''}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  preCompletionNotes: e.target.value,
                });
              }}
              className="mb-2"
            />

            <div className={`${styles.datediv} mt-3 mb-2`}>
              <div>
                <DatePicker
                  label={t('dueDate')}
                  className={styles.datebox}
                  value={dayjs(dueDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setDueDate(date?.toDate());
                    }
                  }}
                />
              </div>
              <div>
                <DatePicker
                  label={t('completionDate')}
                  className={styles.datebox}
                  value={dayjs(completionDate)}
                  onChange={(date: Dayjs | null): void => {
                    if (date) {
                      setCompletionDate(date?.toDate());
                    }
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              className={styles.greenregbtn}
              value="editAgendaItem"
              data-testid="editAgendaItemBtn"
            >
              {t('editAgendaItem')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AgendaItemUpdateModal;
