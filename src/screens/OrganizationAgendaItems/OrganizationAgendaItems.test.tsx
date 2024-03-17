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

import OrganizationAgendaItems from './OrganizationAgendaItems';
import {
  MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY,
  MOCKS_ERROR_AGENDA_ITEM_LIST_QUERY,
  MOCKS_ERROR_MEMBERS_LIST_QUERY,
  MOCKS_ERROR_MUTATIONS,
} from './OrganizationAgendaItemsErrorMocks';
import { MOCKS } from './OrganizationAgendaItemMocks';

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ orgId: '123' }),
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(
  MOCKS_ERROR_AGENDA_ITEM_CATEGORY_LIST_QUERY,
  true,
);
const link3 = new StaticMockLink(MOCKS_ERROR_MEMBERS_LIST_QUERY, true);
const link4 = new StaticMockLink(MOCKS_ERROR_AGENDA_ITEM_LIST_QUERY, true);
const link5 = new StaticMockLink(MOCKS_ERROR_MUTATIONS, true);

const translations = JSON.parse(
  JSON.stringify(
    i18nForTest.getDataByLanguage('en')?.translation.organizationAgendaItems,
  ),
);

describe('Testing Agenda Item Categories Component', () => {
  const formData = {
    agendaItemCategory: 'AgendaItemCategory 1',
    assignee: 'Harve Lance',
    preCompletionNotes: 'pre completion notes',
    dueDate: '02/14/2024',
  };

  test('Component loads correctly', async () => {
    const { getByText } = render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationAgendaItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(getByText(translations.createAgendaItem)).toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful agenda item category list query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link2}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationAgendaItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful members list query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link3}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationAgendaItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  test('render error component on unsuccessful agenda item list query', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false} link={link4}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationAgendaItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        queryByText(translations.createAgendaItem),
      ).not.toBeInTheDocument();
    });
  });

  test('sorts agenda items in earliest or latest first order based on orderBy', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationAgendaItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortAgendaItems'));

    await waitFor(() => {
      expect(screen.getByTestId('earliest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('earliest'));

    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toHaveTextContent(
        translations.earliest,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortAgendaItems'));

    await waitFor(() => {
      expect(screen.getByTestId('latest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('latest'));

    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toHaveTextContent(
        translations.latest,
      );
    });
  });

  test('applies and then clears filters one by one', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationAgendaItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortAgendaItems'));

    await waitFor(() => {
      expect(screen.getByTestId('earliest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('earliest'));

    // all the agenda items ordered by earliest first
    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toHaveTextContent(
        translations.earliest,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectAgendaItemStatus'));

    await waitFor(() => {
      expect(screen.getByTestId('activeAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('activeAgendaItems'));

    // all the agenda items that are active
    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toHaveTextContent(
        translations.active,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectAgendaItemStatus'));

    await waitFor(() => {
      expect(screen.getByTestId('completedAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('completedAgendaItems'));

    // all the agenda items that are completed
    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toHaveTextContent(
        translations.completed,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('selectAgendaItemCategory'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectAgendaItemCategory'));

    await waitFor(() => {
      expect(
        screen.getAllByTestId('agendaItemCategory')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('agendaItemCategory')[0]);

    // agenda items belonging to this agenda item category
    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemCategory')).toHaveTextContent(
        'AgendaItemCategory 1',
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('clearAgendaItemCategoryFilter'),
      ).toBeInTheDocument();
    });
    // remove the agenda item category filter
    userEvent.click(screen.getByTestId('clearAgendaItemCategoryFilter'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('clearAgendaItemCategoryFilter'),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('clearAgendaItemStatusFilter'),
      ).toBeInTheDocument();
    });
    // remove the agenda item status filter
    userEvent.click(screen.getByTestId('clearAgendaItemStatusFilter'));

    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toHaveTextContent(
        translations.status,
      );
      expect(screen.getByTestId('selectAgendaItemCategory')).toHaveTextContent(
        translations.agendaItemCategory,
      );
    });
  });

  test('applies and then clears all the filters', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <I18nextProvider i18n={i18nForTest}>
              {<OrganizationAgendaItems />}
            </I18nextProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('sortAgendaItems'));

    await waitFor(() => {
      expect(screen.getByTestId('earliest')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('earliest'));

    // all the agenda items ordered by earliest first
    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toHaveTextContent(
        translations.earliest,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectAgendaItemStatus'));

    await waitFor(() => {
      expect(screen.getByTestId('activeAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('activeAgendaItems'));

    // all the agenda items that are active
    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toHaveTextContent(
        translations.active,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectAgendaItemStatus'));

    await waitFor(() => {
      expect(screen.getByTestId('completedAgendaItems')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('completedAgendaItems'));

    // all the agenda items that are completed
    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemStatus')).toHaveTextContent(
        translations.completed,
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('selectAgendaItemCategory'),
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('selectAgendaItemCategory'));

    await waitFor(() => {
      expect(
        screen.getAllByTestId('agendaItemCategory')[0],
      ).toBeInTheDocument();
    });
    userEvent.click(screen.getAllByTestId('agendaItemCategory')[0]);

    // agenda items belonging to this agenda item category
    await waitFor(() => {
      expect(screen.getByTestId('selectAgendaItemCategory')).toHaveTextContent(
        'AgendaItemCategory 1',
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('clearFilters')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('clearFilters'));

    // filters cleared, all the agenda items belonging to the organization
    await waitFor(() => {
      expect(screen.getByTestId('sortAgendaItems')).toHaveTextContent(
        translations.latest,
      );
      expect(screen.getByTestId('selectAgendaItemStatus')).toHaveTextContent(
        translations.status,
      );
      expect(screen.getByTestId('selectAgendaItemCategory')).toHaveTextContent(
        translations.agendaItemCategory,
      );
    });
  });

  test('opens and closes the create agenda item modal', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizationAgendaItems />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaItemModalCloseBtn'));

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('createAgendaItemModalCloseBtn'),
    );
  });

  test('creates new agenda item', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizationAgendaItems />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('formSelectAgendaItemCategory'),
      ).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formSelectAgendaItemCategory'),
      formData.agendaItemCategory,
    );

    userEvent.selectOptions(
      screen.getByTestId('formSelectAssignee'),
      formData.assignee,
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      formData.preCompletionNotes,
    );

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    userEvent.click(screen.getByTestId('createAgendaItemFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.success).toBeCalledWith(translations.successfulCreation);
    });
  });

  test('toasts error on unsuccessful creation', async () => {
    render(
      <MockedProvider addTypename={false} link={link5}>
        <Provider store={store}>
          <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <I18nextProvider i18n={i18nForTest}>
                {<OrganizationAgendaItems />}
              </I18nextProvider>
            </LocalizationProvider>
          </BrowserRouter>
        </Provider>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(screen.getByTestId('createAgendaItemBtn')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('createAgendaItemBtn'));

    await waitFor(() => {
      return expect(
        screen.findByTestId('createAgendaItemModalCloseBtn'),
      ).resolves.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('formSelectAgendaItemCategory'),
      ).toBeInTheDocument();
    });

    userEvent.selectOptions(
      screen.getByTestId('formSelectAgendaItemCategory'),
      formData.agendaItemCategory,
    );

    userEvent.selectOptions(
      screen.getByTestId('formSelectAssignee'),
      formData.assignee,
    );

    userEvent.type(
      screen.getByPlaceholderText(translations.preCompletionNotes),
      formData.preCompletionNotes,
    );

    const dueDatePicker = screen.getByLabelText(translations.dueDate);
    fireEvent.change(dueDatePicker, {
      target: { value: formData.dueDate },
    });

    userEvent.click(screen.getByTestId('createAgendaItemFormSubmitBtn'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
