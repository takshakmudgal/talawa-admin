import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from './OrganizationAgendaItems.module.css';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type {
  InterfaceAgendaItemCategoryInfo,
  InterfaceMemberInfo,
} from 'utils/interfaces';

interface InterfaceFormStateType {
  agendaItemCategoryId: string;
  assigneeId: string;
  eventId?: string;
  preCompletionNotes: string;
}

interface InterfaceAgendaItemCreateModalProps {
  agendaItemCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
  membersData: InterfaceMemberInfo[] | undefined;
  dueDate: Date | null;
  setDueDate: (state: React.SetStateAction<Date | null>) => void;
}

const AgendaItemCreateModal: React.FC<InterfaceAgendaItemCreateModalProps> = ({
  agendaItemCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createAgendaItemHandler,
  t,
  agendaItemCategories,
  membersData,
  dueDate,
  setDueDate,
}) => {
  return (
    <>
      <Modal
        className={styles.agendaItemModal}
        show={agendaItemCreateModalIsOpen}
        onHide={hideCreateModal}
      >
        <Modal.Header>
          <p className={styles.titlemodal}>{t('agendaItemDetails')}</p>
          <Button
            variant="danger"
            onClick={hideCreateModal}
            data-testid="createAgendaItemModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={createAgendaItemHandler}>
            <Form.Group className="mb-3">
              <Form.Label>{t('agendaItemCategory')}</Form.Label>
              <Form.Select
                data-testid="formSelectAgendaItemCategory"
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    agendaItemCategoryId: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  {t('selectAgendaItemCategory')}
                </option>
                {agendaItemCategories?.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              <Form.Select
                data-testid="formSelectAssignee"
                required
                defaultValue=""
                onChange={(e) =>
                  setFormState({ ...formState, assigneeId: e.target.value })
                }
              >
                <option value="" disabled>
                  {t('selectAssignee')}
                </option>
                {membersData?.map((member, index) => (
                  <option key={index} value={member._id}>
                    {`${member.firstName} ${member.lastName}`}
                  </option>
                ))}
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
              value={formState.preCompletionNotes}
              onChange={(e): void => {
                setFormState({
                  ...formState,
                  preCompletionNotes: e.target.value,
                });
              }}
            />

            <div>
              <DatePicker
                label={t('dueDate')}
                className="mb-3 w-100"
                value={dayjs(dueDate)}
                onChange={(date: Dayjs | null): void => {
                  if (date) {
                    setDueDate(date?.toDate());
                  }
                }}
              />
            </div>

            <Button
              type="submit"
              className={styles.greenregbtn}
              value="createAgendaItem"
              data-testid="createAgendaItemFormSubmitBtn"
            >
              {t('createAgendaItem')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AgendaItemCreateModal;
