import React, { useState } from 'react';
import dayjs from 'dayjs';
import type { ChangeEvent } from 'react';
import {
  Button,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  DELETE_AGENDA_ITEM_MUTATION,
  UPDATE_AGENDA_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

import type {
  InterfaceAgendaItemInfo,
  InterfaceMemberInfo,
} from 'utils/interfaces';
import styles from './AgendaItemsContainer.module.css';
import AgendaItemUpdateModal from '../../screens/OrganizationAgendaItems/AgendaItemUpdateModal';
import AgendaItemPreviewModal from '../../screens/OrganizationAgendaItems/AgendaItemPreviewModal';
import AgendaItemDeleteModal from '../../screens/OrganizationAgendaItems/AgendaItemDeleteModal';

function agendaItemsContainer({
  agendaItemsConnection,
  agendaItemsData,
  membersData,
  agendaItemsRefetch,
}: {
  agendaItemsConnection: 'Organization' | 'Event';
  agendaItemsData: InterfaceAgendaItemInfo[] | undefined;
  membersData: InterfaceMemberInfo[] | undefined;
  agendaItemsRefetch: any;
}): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'organizationAgendaItems',
  });

  const [agendaItemPreviewModalIsOpen, setAgendaItemPreviewModalIsOpen] =
    useState(false);
  const [agendaItemUpdateModalIsOpen, setAgendaItemUpdateModalIsOpen] =
    useState(false);
  const [agendaItemDeleteModalIsOpen, setAgendaItemDeleteModalIsOpen] =
    useState(false);
  const [agendaItemStatusModal, setAgendaItemStatusModal] = useState(false);
  const [isAgendaItemCompleted, setIsAgendaItemCompleted] = useState(false);

  const [assignmentDate, setAssignmentDate] = useState<Date | null>(new Date());
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [completionDate, setCompletionDate] = useState<Date | null>(new Date());
  const [agendaItemId, setAgendaItemId] = useState('');
  const [agendaItemNotes, setAgendaItemNotes] = useState('');

  const [formState, setFormState] = useState({
    assignee: '',
    assigner: '',
    assigneeId: '',
    preCompletionNotes: '',
    postCompletionNotes: '',
    isCompleted: false,
  });

  const showPreviewModal = (agendaItem: InterfaceAgendaItemInfo): void => {
    setAgendaItemState(agendaItem);
    setAgendaItemPreviewModalIsOpen(true);
  };

  const showUpdateModal = (): void => {
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  const hidePreviewModal = (): void => {
    setAgendaItemPreviewModalIsOpen(false);
  };

  const hideUpdateModal = (): void => {
    setAgendaItemId('');
    setAgendaItemUpdateModalIsOpen(!agendaItemUpdateModalIsOpen);
  };

  const toggleDeleteModal = (): void => {
    setAgendaItemDeleteModalIsOpen(!agendaItemDeleteModalIsOpen);
  };

  const [updateAgendaItem] = useMutation(UPDATE_AGENDA_ITEM_MUTATION);

  const updateAgendaItemHandler = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await updateAgendaItem({
        variables: {
          agendaItemId,
          assigneeId: formState.assigneeId,
          preCompletionNotes: formState.preCompletionNotes,
          postCompletionNotes: formState.postCompletionNotes,
          dueDate: dayjs(dueDate).format('YYYY-MM-DD'),
          completionDate: dayjs(completionDate).format('YYYY-MM-DD'),
          isCompleted: formState.isCompleted,
        },
      });

      agendaItemsRefetch();
      hideUpdateModal();
      toast.success(t('successfulUpdation'));
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const [removeAgendaItem] = useMutation(DELETE_AGENDA_ITEM_MUTATION);
  const deleteAgendaItemHandler = async (): Promise<void> => {
    try {
      await removeAgendaItem({
        variables: {
          agendaItemId,
        },
      });

      agendaItemsRefetch();
      toggleDeleteModal();
      toast.success(t('successfulDeletion'));
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEditClick = (agendaItem: InterfaceAgendaItemInfo): void => {
    setAgendaItemState(agendaItem);
    showUpdateModal();
  };

  const handleAgendaItemStatusChange = (
    agendaItem: InterfaceAgendaItemInfo,
  ): void => {
    agendaItem = { ...agendaItem, isCompleted: !agendaItem.isCompleted };
    setIsAgendaItemCompleted(!agendaItem.isCompleted);
    setAgendaItemState(agendaItem);
    setAgendaItemStatusModal(true);
  };

  const hideAgendaItemStatusModal = (): void => {
    setAgendaItemStatusModal(false);
  };

  const setAgendaItemState = (agendaItem: InterfaceAgendaItemInfo): void => {
    setFormState({
      ...formState,
      assignee: `${agendaItem.assignee.firstName} ${agendaItem.assignee.lastName}`,
      assigner: `${agendaItem.assigner.firstName} ${agendaItem.assigner.lastName}`,
      assigneeId: agendaItem.assignee._id,
      preCompletionNotes: agendaItem.preCompletionNotes,
      postCompletionNotes: agendaItem.postCompletionNotes,
      isCompleted: agendaItem.isCompleted,
    });
    setAgendaItemId(agendaItem._id);
    setDueDate(agendaItem.dueDate);
    setAssignmentDate(agendaItem.assignmentDate);
    setCompletionDate(agendaItem.completionDate);
  };

  const popover = (
    <Popover
      id={`popover-${agendaItemId}`}
      data-testid={`popover-${agendaItemId}`}
    >
      <Popover.Body>{agendaItemNotes}</Popover.Body>
    </Popover>
  );

  return (
    <>
      <div
        className={`mx-1 ${agendaItemsConnection === 'Organization' ? 'my-4' : 'my-0'}`}
      >
        <div
          className={`shadow-sm ${agendaItemsConnection === 'Organization' ? 'rounded-top-4 mx-4' : 'rounded-top-2 mx-0'}`}
        >
          <Row
            className={`mx-0 border border-light-subtle py-3 ${agendaItemsConnection === 'Organization' ? 'rounded-top-4' : 'rounded-top-2'}`}
          >
            <Col
              xs={7}
              sm={4}
              md={3}
              lg={2}
              className="align-self-center ps-3 fw-bold"
            >
              <div className="ms-2">{t('assignee')}</div>
            </Col>
            <Col className="fw-bold d-none d-sm-block" sm={5} md={6} lg={3}>
              {t('agendaItemCategory')}
            </Col>
            <Col
              className="d-none d-lg-block fw-bold align-self-center"
              md={4}
              lg={2}
            >
              <div className="ms-3">{t('preCompletionNotes')}</div>
            </Col>
            <Col
              className="d-none d-lg-block fw-bold align-self-center"
              md={4}
              lg={3}
            >
              <div className="ms-3">{t('postCompletionNotes')}</div>
            </Col>
            <Col xs={5} sm={3} lg={2} className="fw-bold align-self-center">
              <div className="ms-3">{t('options')}</div>
            </Col>
          </Row>
        </div>

        <div
          className={`bg-light-subtle border border-light-subtle border-top-0 shadow-sm ${agendaItemsConnection === 'Organization' ? 'rounded-bottom-4 mx-4' : 'rounded-bottom-2 mb-2 mx-0'}`}
        >
          {agendaItemsData?.map((agendaItem, index) => (
            <div key={index}>
              <Row className={`${index === 0 ? 'pt-3' : ''} mb-3 mx-2`}>
                <Col
                  sm={4}
                  xs={7}
                  md={3}
                  lg={2}
                  className="align-self-center text-body-secondary"
                >
                  {`${agendaItem.assignee.firstName} ${agendaItem.assignee.lastName}`}
                </Col>
                <Col
                  sm={5}
                  md={6}
                  lg={2}
                  className="p-1 d-none d-sm-block align-self-center text-body-secondary"
                >
                  {agendaItem.agendaItemCategory.name}
                </Col>
                <Col
                  className="p-0 d-none d-lg-block align-self-center text-body-secondary"
                  md={4}
                  lg={3}
                >
                  <div className="ms-5">
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      placement="right"
                      overlay={popover}
                    >
                      <span
                        data-testid="agendaItemPreCompletionNotesOverlay"
                        onMouseEnter={() => {
                          setAgendaItemId(agendaItem._id);
                          setAgendaItemNotes(agendaItem.preCompletionNotes);
                        }}
                      >
                        {agendaItem.preCompletionNotes.length > 25
                          ? `${agendaItem.preCompletionNotes.substring(0, 25)}...`
                          : agendaItem.preCompletionNotes}
                      </span>
                    </OverlayTrigger>
                  </div>
                </Col>
                <Col
                  className="p-0 d-none d-lg-block align-self-center text-body-secondary"
                  md={4}
                  lg={3}
                >
                  <div className="ms-3">
                    {agendaItem.isCompleted ? (
                      <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement="right"
                        overlay={popover}
                      >
                        <span
                          data-testid="agendaItemPostCompletionNotesOverlay"
                          onMouseEnter={() => {
                            setAgendaItemId(agendaItem._id);
                            setAgendaItemNotes(agendaItem.postCompletionNotes);
                          }}
                        >
                          {agendaItem.postCompletionNotes?.length > 25
                            ? `${agendaItem.postCompletionNotes.substring(0, 25)}...`
                            : agendaItem.postCompletionNotes}
                        </span>
                      </OverlayTrigger>
                    ) : (
                      <span className="text-body-tertiary ms-3 fst-italic">
                        {t('agendaItemActive')}
                      </span>
                    )}
                  </div>
                </Col>
                <Col xs={5} sm={3} lg={2} className="p-0 align-self-center">
                  <div className="d-flex align-items-center ms-4 gap-2">
                    <input
                      type="checkbox"
                      id="agendaItemStatusChangeCheckbox"
                      data-testid="agendaItemStatusChangeCheckbox"
                      className="form-check-input d-inline mt-0 me-1"
                      checked={agendaItem.isCompleted}
                      onChange={() => handleAgendaItemStatusChange(agendaItem)}
                    />
                    <Button
                      data-testid="previewAgendaItemModalBtn"
                      className={`${styles.agendaItemsOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => showPreviewModal(agendaItem)}
                    >
                      <i className="fas fa-info fa-sm"></i>
                    </Button>
                    <Button
                      size="sm"
                      data-testid="editAgendaItemModalBtn"
                      onClick={() => handleEditClick(agendaItem)}
                      className={`${styles.agendaItemsOptionsButton} d-flex align-items-center justify-content-center`}
                      variant="outline-secondary"
                    >
                      {' '}
                      <i className="fas fa-edit fa-sm"></i>
                    </Button>
                  </div>
                </Col>
              </Row>

              {index !== agendaItemsData.length - 1 && <hr className="mx-3" />}
            </div>
          ))}

          {agendaItemsData?.length === 0 && (
            <div className="lh-lg text-center fw-semibold text-body-tertiary">
              {t('noAgendaItems')}
            </div>
          )}
        </div>
      </div>

      {/* agenda item status change modal */}
      <Modal
        className={styles.createModal}
        show={agendaItemStatusModal}
        onHide={hideAgendaItemStatusModal}
      >
        <Modal.Header>
          <p className={`${styles.titlemodal}`}>{t('agendaItemStatus')}</p>
          <Button
            variant="danger"
            onClick={hideAgendaItemStatusModal}
            data-testid="agendaItemStatusChangeModalCloseBtn"
          >
            <i className="fa fa-times"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmitCapture={updateAgendaItemHandler}>
            <Form.Label
              className="ms-1 fs-6 mt-2 mb-0"
              htmlFor="agendaItemCategoryName"
            >
              {isAgendaItemCompleted
                ? t('preCompletionNotes')
                : t('postCompletionNotes')}
            </Form.Label>
            <Form.Control
              type="title"
              id="agendaItemsStatusChangeNotes"
              data-testid="agendaItemsStatusChangeNotes"
              placeholder={t('agendaItemCompleted')}
              autoComplete="off"
              required
              value={
                isAgendaItemCompleted
                  ? formState.preCompletionNotes
                  : formState.postCompletionNotes ?? ''
              }
              onChange={(e): void => {
                if (isAgendaItemCompleted) {
                  setFormState({
                    ...formState,
                    preCompletionNotes: e.target.value,
                  });
                } else {
                  setFormState({
                    ...formState,
                    postCompletionNotes: e.target.value,
                  });
                }
              }}
            />
            <Button
              type="submit"
              className={styles.greenregbtn}
              value="agendaItemStatusChange"
              data-testid="agendaItemStatusChangeSubmitBtn"
            >
              {isAgendaItemCompleted ? t('makeActive') : t('markCompletion')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* preview modal */}
      <AgendaItemPreviewModal
        agendaItemPreviewModalIsOpen={agendaItemPreviewModalIsOpen}
        hidePreviewModal={hidePreviewModal}
        showUpdateModal={showUpdateModal}
        toggleDeleteModal={toggleDeleteModal}
        formState={formState}
        t={t}
        dueDate={dueDate}
        completionDate={completionDate}
        assignmentDate={assignmentDate}
      />

      {/* Update Modal */}
      <AgendaItemUpdateModal
        agendaItemUpdateModalIsOpen={agendaItemUpdateModalIsOpen}
        hideUpdateModal={hideUpdateModal}
        formState={formState}
        setFormState={setFormState}
        updateAgendaItemHandler={updateAgendaItemHandler}
        t={t}
        membersData={membersData}
        dueDate={dueDate}
        setDueDate={setDueDate}
        completionDate={completionDate}
        setCompletionDate={setCompletionDate}
      />

      {/* Delete Modal */}
      <AgendaItemDeleteModal
        agendaItemDeleteModalIsOpen={agendaItemDeleteModalIsOpen}
        deleteAgendaItemHandler={deleteAgendaItemHandler}
        toggleDeleteModal={toggleDeleteModal}
        t={t}
      />
    </>
  );
}

export default agendaItemsContainer;
