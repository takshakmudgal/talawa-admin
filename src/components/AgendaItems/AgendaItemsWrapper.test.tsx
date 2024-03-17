import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { AgendaItemsWrapper } from './AgendaItemsWrapper';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticMockLink } from 'utils/StaticMockLink';
import userEvent from '@testing-library/user-event';
import { MOCKS } from '../../screens/OrganizationAgendaItems/OrganizationAgendaItemMocks';

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);

describe('Testing Agenda Items Wrapper', () => {
  const props = {
    eventId: 'event1',
    orgId: '123',
  };

  test('The button to open and close the modal should work properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <AgendaItemsWrapper {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await waitFor(() => {
      expect(
        screen.getByLabelText('eventDashboardAgendaItems'),
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText('eventDashboardAgendaItems'));

    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).toBeInTheDocument(),
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toBeInTheDocument();
    });

    userEvent.click(screen.getByLabelText('Close'));

    await waitFor(() =>
      expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument(),
    );
  });
});
