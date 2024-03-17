import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'jest-localstorage-mock';
import { MockedProvider } from '@apollo/client/testing';
import 'jest-location-mock';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import i18nForTest from 'utils/i18nForTest';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';

import AgendaItemsContainer from './AgendaItemsContainer';
import { props, props2 } from './AgendaItemsContainerProps';
import { MOCKS, MOCKS_ERROR_MUTATIONS } from './AgendaItemsContainerMocks';

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@mui/x-date-pickers/DateTimePicker', () => {
  return {
    DateTimePicker: jest.requireActual(
      '@mui/x-date-pickers/DesktopDateTimePicker',
    ).DesktopDateTimePicker,
  };
});

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationAgendaItems,
  ),
);

describe('Testing Agenda Item Categories Component', () => {
  const formData = {
    assignee: 'Scott Norris',
    preCompletionNotes: 'pre completion notes edited',
    dueDate: '02/14/2024',
    completionDate: '02/21/2024',
  };

  test('component loads correctly with agenda items', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaItems),
      ).not.toBeInTheDocument();
    });
  });

  test('component loads correctly with no agenda items', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              <AgendaItemsContainer {...props2} />
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.queryByText(translations.noAgendaItems),
      ).toBeInTheDocument();
    });
  });

  test('opens and closes the update modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateAgendaItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updateAgendaItemModalCloseBtn'),
    );
  });

  test('opens and closes the agenda item status change modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('agendaItemStatusChangeCheckbox')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('agendaItemStatusChangeCheckbox')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('agendaItemStatusChangeModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('agendaItemStatusChangeModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('agendaItemStatusChangeModalCloseBtn'),
    );
  });

  test('opens and closes the preview modal correctly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('previewAgendaItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('previewAgendaItemModalCloseBtn'),
    );
  });

  test('opens and closes the update and delete modals through the preview modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('agendaItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('agendaItemDeleteModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('agendaItemDeleteModalCloseBtn'),
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('editAgendaItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editAgendaItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('updateAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('updateAgendaItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('updateAgendaItemModalCloseBtn'),
    );
  });

  test('updates an agenda item and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('formUpdateAssignee')).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formUpdateAssignee'),
      formData.assignee,
    );

    const preCompletionNotes = screen.getByPlaceholderText(
      translations.preCompletionNotes,
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(preCompletionNotes, formData.preCompletionNotes);

    // const postCompletionNotes = screen.getByPlaceholderText(
    //   translations.postCompletionNotes,
    // );
    // fireEvent.change(postCompletionNotes, { target: { value: '' } });
    // userEvent.type(postCompletionNotes, formData.postCompletionNotes);

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    const completionDatePicker = screen.getByLabelText(
      translations.completionDate,
    );
    fireEvent.change(completionDatePicker, {
      target: { value: formData.completionDate },
    });

    // await waitFor(() => {
    //   expect(screen.getByTestId('alldayCheck')).toBeInTheDocument();
    // });
    // userEvent.click(screen.getByTestId('alldayCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });
  });

  test('toasts error on unsuccessful updation', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('editAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('editAgendaItemModalBtn')[0]);

    await waitFor(() => {
      expect(screen.getByTestId('formUpdateAssignee')).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formUpdateAssignee'),
      formData.assignee,
    );

    const preCompletionNotes = screen.getByPlaceholderText(
      translations.preCompletionNotes,
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(preCompletionNotes, formData.preCompletionNotes);

    // const postCompletionNotes = screen.getByPlaceholderText(
    //   translations.postCompletionNotes,
    // );
    // fireEvent.change(postCompletionNotes, { target: { value: '' } });
    // userEvent.type(postCompletionNotes, formData.postCompletionNotes);

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    const completionDatePicker = screen.getByLabelText(
      translations.completionDate,
    );
    fireEvent.change(completionDatePicker, {
      target: { value: formData.completionDate },
    });

    // await waitFor(() => {
    //   expect(screen.getByTestId('alldayCheck')).toBeInTheDocument();
    // });
    // userEvent.click(screen.getByTestId('alldayCheck'));

    await waitFor(() => {
      expect(screen.getByTestId('editAgendaItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('editAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('updates an agenda item status through the agenda item status change modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('agendaItemStatusChangeCheckbox')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('agendaItemStatusChangeCheckbox')[0]);

    await waitFor(() => {
      expect(
        screen.getByTestId('agendaItemsStatusChangeNotes'),
      ).toBeInTheDocument();
    });

    const postCompletionNotes = screen.getByTestId(
      'agendaItemsStatusChangeNotes',
    );
    fireEvent.change(postCompletionNotes, { target: { value: '' } });
    userEvent.type(
      postCompletionNotes,
      'this agenda item has been completed successfully',
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('agendaItemStatusChangeSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('agendaItemStatusChangeSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });

    await waitFor(() => {
      expect(
        screen.getAllByTestId('agendaItemStatusChangeCheckbox')[1],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('agendaItemStatusChangeCheckbox')[1]);

    await waitFor(() => {
      expect(
        screen.getByTestId('agendaItemsStatusChangeNotes'),
      ).toBeInTheDocument();
    });

    const preCompletionNotes = screen.getByTestId(
      'agendaItemsStatusChangeNotes',
    );
    fireEvent.change(preCompletionNotes, { target: { value: '' } });
    userEvent.type(
      preCompletionNotes,
      'this agenda item has been made active again',
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('agendaItemStatusChangeSubmitBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('agendaItemStatusChangeSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulUpdation);
    });
  });

  test('deletes the agenda item and toasts success', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('agendaItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('deleteAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulDeletion);
    });
  });

  test('toasts error on unsuccessful deletion', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('previewAgendaItemModalBtn')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('previewAgendaItemModalBtn')[0]);

    await waitFor(() => {
      return expect(
        screen.findByTestId('previewAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deleteAgendaItemPreviewModalBtn'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaItemPreviewModalBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('agendaItemDeleteModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('deleteAgendaItemBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  test('shows the overlay text on agenda item notes', async () => {
    const { getAllByTestId } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                <AgendaItemsContainer {...props} />
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getAllByTestId('agendaItemPreCompletionNotesOverlay')[0],
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.mouseEnter(
        getAllByTestId('agendaItemPreCompletionNotesOverlay')[0],
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('popover-agendaItem1')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.mouseLeave(
        getAllByTestId('agendaItemPreCompletionNotesOverlay')[0],
      );
    });

    await waitFor(() => {
      fireEvent.mouseEnter(
        getAllByTestId('agendaItemPostCompletionNotesOverlay')[0],
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('popover-agendaItem2')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.mouseLeave(
        getAllByTestId('agendaItemPostCompletionNotesOverlay')[0],
      );
    });
  });
});
